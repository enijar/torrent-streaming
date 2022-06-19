import fetch from "node-fetch";
import Stream from "../entities/stream";
import { Torrent } from "../types";

function getTitle(movie: any): string {
  function get(movie: any, key: string): string {
    const value: string = (movie[key] ?? "").trim();
    if (value.length === 0) return undefined;
    return value;
  }

  return (
    get(movie, "title") ??
    get(movie, "title_english") ??
    get(movie, "title_long")
  );
}

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

    const englishMovies = movies.filter((movie: any) => {
      return movie.language === "en";
    });

    const streams: Data["streams"] = englishMovies.map((movie: any) => {
      let seeds = 0;
      const torrents: Torrent[] = movie.torrents.map((torrent: any) => {
        seeds += torrent.seeds;
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
        title: getTitle(movie),
        year: movie.year,
        rating: movie.rating,
        duration: movie.runtime,
        genres: movie.genres,
        synopsis: movie.synopsis,
        youTubeTrailerCode: movie.yt_trailer_code,
        imdbCode: movie.imdb_code,
        largeCoverImage: movie.large_cover_image,
        torrents,
        seeds,
      };
    });
    return { streams, nextPage };
  } catch (err) {
    console.error(err);
    return { streams: [], nextPage: null };
  }
}

export default async function updateMovies(page: number = 1) {
  try {
    console.log(`Page ${page}`);

    const data = await fetchData(page);

    await Promise.all(data.streams.map((stream) => Stream.upsert(stream)));

    if (data.nextPage !== null) {
      await updateMovies(data.nextPage);
    }
  } catch (err) {
    console.error(err);
  }
}
