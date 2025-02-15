import * as fs from "node:fs/promises";
import { execSync } from "node:child_process";
import * as path from "node:path";
import config from "~/config.js";

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IGNORED_FILES = [".DS_Store", ".gitignore"];

export default async function deleteOldTorrentFiles() {
  const now = Date.now();
  const torrents = await fs.readdir(config.paths.torrents, { recursive: true });
  await Promise.all(
    torrents.map(async (file) => {
      if (IGNORED_FILES.includes(file)) return;
      try {
        const filePath = path.join(config.paths.torrents, file);
        const stats = await fs.stat(filePath);
        const time = Math.round(now - stats.mtimeMs);
        if (time > ONE_DAY_IN_MS) {
          execSync(`rm -rf '${filePath}'`);
        }
      } catch (err) {
        console.error(err);
      }
    }),
  );
}
