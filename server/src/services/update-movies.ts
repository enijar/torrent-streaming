import { Presets, SingleBar } from "cli-progress";
import { z, ZodError } from "zod";
import _ from "lodash";
import { fetch } from "undici";
import Stream from "~/entities/stream.js";
import agent from "~/services/agent.js";

const schema = z.object({
  data: z.object({
    movie_count: z.number(),
    limit: z.number(),
    page_number: z.number(),
    movies: z.array(
      z.object({
        id: z.number(),
        title: z.string().optional().nullable().default(null),
        title_english: z.string().optional().nullable().default(null),
        title_long: z.string().optional().nullable().default(null),
        year: z.number(),
        rating: z.number(),
        runtime: z.number(),
        genres: z.array(z.string()).optional().default([]),
        synopsis: z.string(),
        yt_trailer_code: z.string(),
        imdb_code: z.string(),
        large_cover_image: z.url(),
        torrents: z.array(
          z.object({
            url: z.url(),
            hash: z.string(),
            quality: z.string(),
            type: z.string(),
            seeds: z.number(),
            peers: z.number(),
            size_bytes: z.number(),
          }),
        ),
      }),
    ),
  }),
});

export default async function updateMovies() {
  const progress = new SingleBar({}, Presets.shades_classic);
  const limit = 50;
  const concurrent = 10;
  const maxPages = Infinity;
  const url = new URL("https://yts.lt/api/v2/list_movies.json");
  url.searchParams.set("sort", "download_count");
  url.searchParams.set("quality", "1080p");
  url.searchParams.set("language", "en");
  url.searchParams.set("limit", limit.toString());
  url.searchParams.set("page", "1");
  const addStreams = async (page: number) => {
    url.searchParams.set("page", page.toString());
    const res = await fetch(url.toString(), { dispatcher: agent });
    const json = await res.json();
    const { data } = schema.parse(json);
    await Promise.all(
      data.movies.map((movie) => {
        let seeds = 0;
        const torrents = movie.torrents.map((torrent) => {
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
        return Stream.upsert({
          apiId: movie.id,
          title: movie.title ?? movie.title_english ?? movie.title_long ?? "",
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
        });
      }),
    );
  };
  try {
    const res = await fetch(url.toString(), { dispatcher: agent });
    const { data } = schema.parse(await res.json());
    const pages = Math.min(Math.ceil(data.movie_count / limit), maxPages);
    progress.start(pages, 0);
    const requests = Array.from({ length: pages }).map((_, index) => {
      return () => addStreams(index + 1);
    });
    const chunks = _.chunk(requests, concurrent);
    for (const requests of chunks) {
      await Promise.all(
        requests.map(async (request) => {
          await request();
          progress.increment();
        }),
      );
    }
  } catch (err) {
    if (err instanceof ZodError) {
      console.error(...err.issues);
    } else {
      console.error(err);
    }
  } finally {
    progress.stop();
  }
}
