import { execSync } from "node:child_process";
import { schedule } from "node-cron";
import updateMovies from "~/services/update-movies.js";
import deleteOldTorrentFiles from "~/services/delete-old-torrent-files.js";

// Every 12 hours
schedule("0 */12 * * *", async () => {
  console.log(`[cron: start] update-movies`);
  await updateMovies();
  console.log(`[cron: end] update-movies`);
});
// Every 8 hours
schedule("0 */6 * * *", async () => {
  console.log(`[cron: start] delete-old-torrent-files`);
  await deleteOldTorrentFiles();
  console.log(`[cron: end] delete-old-torrent-files`);
});
// 2AM daily
schedule("0 2 * * *", async () => {
  console.log(`[cron: start] restart`);
  execSync(`pm2 reload torrent-streaming`, { stdio: "inherit" });
  console.log(`[cron: end] restart`);
});
