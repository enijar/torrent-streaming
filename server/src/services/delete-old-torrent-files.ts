import * as fs from "fs";
import { execSync } from "child_process";
import * as path from "path";
import config from "../config";

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IGNORED_FILES = [".DS_Store", ".gitignore"];

export default async function deleteOldTorrentFiles() {
  const now = Date.now();
  const torrents = fs.readdirSync(config.paths.torrents);
  torrents.forEach((file) => {
    if (IGNORED_FILES.includes(file)) return;
    try {
      const filePath = path.join(config.paths.torrents, file);
      const stats = fs.statSync(filePath);
      const time = Math.round(now - stats.mtimeMs);
      if (time > ONE_DAY_IN_MS) {
        execSync(`rm -rf '${filePath}'`);
      }
    } catch (err) {
      console.error(err);
    }
  });
}
