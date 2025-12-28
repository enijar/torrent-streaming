import { fetch } from "undici";
import { z } from "zod";
import config from "~/config.js";

const BASE_URL = "https://api.themoviedb.org/3";

// Zod schemas for TMDb API responses
const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  popularity: z.number(),
  vote_average: z.number(),
  vote_count: z.number(),
  release_date: z.string().optional(),
  adult: z.boolean().optional(),
});

const trendingResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

const findResponseSchema = z.object({
  movie_results: z.array(
    movieSchema.extend({
      imdb_id: z.string().optional(),
    }),
  ),
});

const movieDetailsSchema = movieSchema.extend({
  imdb_id: z.string().optional().nullable(),
  runtime: z.number().optional().nullable(),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).optional(),
  overview: z.string().optional(),
});

export type TMDbMovie = z.infer<typeof movieSchema>;
export type TMDbMovieDetails = z.infer<typeof movieDetailsSchema>;

/**
 * Makes an authenticated request to TMDb API
 */
async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  if (!config.tmdb.apiKey) {
    throw new Error("TMDb API key not configured");
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${config.tmdb.apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get trending movies for the week
 * @param page Page number (default: 1)
 * @returns Array of trending movies with popularity scores
 */
export async function getTrendingMovies(page: number = 1): Promise<TMDbMovie[]> {
  const data = await tmdbFetch("/trending/movie/week", { page: page.toString() });
  const parsed = trendingResponseSchema.parse(data);
  return parsed.results;
}

/**
 * Find a movie by IMDB ID
 * @param imdbId IMDB ID (e.g., "tt1234567")
 * @returns Movie details if found, null otherwise
 */
export async function findMovieByImdbId(imdbId: string): Promise<TMDbMovieDetails | null> {
  const data = await tmdbFetch(`/find/${imdbId}`, { external_source: "imdb_id" });
  const parsed = findResponseSchema.parse(data);

  if (parsed.movie_results.length === 0) {
    return null;
  }

  // Get full details for the first result
  return getMovieDetails(parsed.movie_results[0].id);
}

/**
 * Get detailed information for a movie by TMDb ID
 * @param tmdbId TMDb movie ID
 * @returns Movie details
 */
export async function getMovieDetails(tmdbId: number): Promise<TMDbMovieDetails> {
  const data = await tmdbFetch(`/movie/${tmdbId}`);
  return movieDetailsSchema.parse(data);
}

/**
 * Batch fetch TMDb data for multiple movies by IMDB IDs
 * Respects TMDb rate limit of 40 requests per 10 seconds
 * @param imdbIds Array of IMDB IDs
 * @returns Map of IMDB ID to TMDb movie details
 */
export async function batchFindMoviesByImdbIds(imdbIds: string[]): Promise<Map<string, TMDbMovieDetails>> {
  const results = new Map<string, TMDbMovieDetails>();

  // TMDb API allows 40 requests per 10 seconds = 4 req/sec
  // Each movie requires 2 API calls (find by IMDB + get details)
  // Process 10 movies in parallel (20 requests), wait 5 seconds between batches
  const batchSize = 10;
  const delayMs = 5000;

  for (let i = 0; i < imdbIds.length; i += batchSize) {
    const batch = imdbIds.slice(i, i + batchSize);

    // Process batch in parallel
    const batchPromises = batch.map(async (imdbId) => {
      try {
        const movie = await findMovieByImdbId(imdbId);
        if (movie) {
          results.set(imdbId, movie);
        }
      } catch {}
    });

    await Promise.all(batchPromises);

    // Add delay between batches to respect rate limits
    if (i + batchSize < imdbIds.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}
