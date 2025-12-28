import { fetch } from "undici";
import { z } from "zod";
import { createGunzip } from "zlib";

const exportMovieSchema = z.object({
  id: z.number(),
  original_title: z.string(),
  popularity: z.number(),
  adult: z.boolean().optional(),
  video: z.boolean().optional(),
});

export type TMDbExportMovie = z.infer<typeof exportMovieSchema>;

/**
 * Downloads and parses TMDb daily export file
 * @param date Date to download (defaults to yesterday to ensure file exists)
 * @returns Map of normalized title to movie data
 */
export async function downloadTMDbExport(
  date: Date = getYesterday(),
): Promise<Map<string, TMDbExportMovie>> {
  const formattedDate = formatDateForExport(date);
  const url = `https://files.tmdb.org/p/exports/movie_ids_${formattedDate}.json.gz`;

  console.log(`Downloading TMDb export: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download TMDb export: ${response.status} ${response.statusText}`);
    }

    // Download and decompress the gzipped file
    const buffer = await response.arrayBuffer();
    const decompressed = await decompressGzip(Buffer.from(buffer));

    // Parse JSONL (one JSON object per line)
    const lines = decompressed.toString("utf-8").trim().split("\n");
    const movies = new Map<string, TMDbExportMovie>();

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const parsed = exportMovieSchema.parse(JSON.parse(line));

        // Normalize title for matching (lowercase, remove special chars)
        const normalizedTitle = normalizeTitle(parsed.original_title);
        movies.set(normalizedTitle, parsed);
      } catch (err) {
        // Skip invalid entries
        continue;
      }
    }

    console.log(`Loaded ${movies.size} movies from TMDb export`);
    return movies;
  } catch (err) {
    console.error(`Failed to download TMDb export for ${formattedDate}:`, err);

    // Try previous day if today's file doesn't exist yet
    if (date.getTime() > getYesterday().getTime()) {
      console.log("Retrying with yesterday's export...");
      return downloadTMDbExport(getYesterday());
    }

    throw err;
  }
}

/**
 * Decompresses a gzipped buffer
 */
async function decompressGzip(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const gunzip = createGunzip();

    gunzip.on("data", (chunk) => chunks.push(chunk));
    gunzip.on("end", () => resolve(Buffer.concat(chunks)));
    gunzip.on("error", reject);

    gunzip.write(buffer);
    gunzip.end();
  });
}

/**
 * Normalizes a movie title for fuzzy matching
 * Removes special characters, converts to lowercase, removes articles
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/^(the|a|an)\s+/i, "") // Remove leading articles
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Formats date as MM_DD_YYYY for export file naming
 */
function formatDateForExport(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}_${day}_${year}`;
}

/**
 * Gets yesterday's date
 */
function getYesterday(): Date {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

/**
 * Finds a movie in the export data by title
 * @param exportData Map of normalized titles to movie data
 * @param title Movie title to search for
 * @returns TMDb movie data if found, null otherwise
 */
export function findMovieInExport(
  exportData: Map<string, TMDbExportMovie>,
  title: string,
): TMDbExportMovie | null {
  const normalizedTitle = normalizeTitle(title);
  return exportData.get(normalizedTitle) ?? null;
}
