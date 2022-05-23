import fetch from "node-fetch";
import database from "../services/database";
import Stream from "../entities/stream";
import { Torrent } from "../types";

type Data = {
  nextPage: number | null;
  streams: Stream["_attributes"][];
};

async function fetchData(page: number): Promise<Data> {
  try {
    const limit = 50;
    const url = new URL("https://yts.mx/api/v2/list_movies.json");
    url.searchParams.set("sort_by", "download_count");
    url.searchParams.set("quality", "1080p");
    url.searchParams.set("limit", limit.toString());
    url.searchParams.set("language", "en");
    url.searchParams.set("page", page.toString());

    const res = await fetch(url.toString());
    const json: any = await res.json();
    const { movies = [] } = json?.data ?? {};
    const totalStreams = json?.data?.movie_count ?? 0;
    const collectedStreams = page * limit;
    let nextPage: Data["nextPage"] = null;

    if (collectedStreams < totalStreams) {
      nextPage = page + 1;
    }

    const streams: Data["streams"] = movies.map((movie: any) => {
      const torrents: Torrent[] = movie.torrents.map((torrent: any) => {
        return {
          url: torrent.url,
          hash: torrent.hash,
          quality: torrent.quality,
          type: torrent.type,
          seeds: torrent.seeds,
          peers: torrent.peers,
          size: torrent.size_bytes,
        };
      });

      return {
        apiId: movie.id,
        title: movie.title,
        year: movie.year,
        rating: movie.rating,
        duration: movie.runtime,
        genres: movie.genres,
        synopsis: movie.synopsis,
        youTubeTrailerCode: movie.yt_trailer_code,
        imdbCode: movie.imdb_code,
        largeCoverImage: movie.large_cover_image,
        torrents,
      };
    });
    return { streams, nextPage };
  } catch (err) {
    console.error(err);
    return { streams: [], nextPage: null };
  }
}

(async () => {
  try {
    await database.sync({ alter: true });

    await (async function tick(page: number = 1) {
      console.log(`Page ${page}`);

      const data = await fetchData(page);

      await Stream.bulkCreate(data.streams, {
        updateOnDuplicate: [
          "title",
          "year",
          "rating",
          "duration",
          "genres",
          "synopsis",
          "youTubeTrailerCode",
          "imdbCode",
          "largeCoverImage",
          "torrents",
        ],
      });

      if (data.nextPage !== null) {
        await tick(data.nextPage);
      }
    })();

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
