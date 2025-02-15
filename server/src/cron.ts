import { schedule } from "node-cron";
import { time } from "~/utils.js";
import updateMovies from "~/services/update-movies.js";
import deleteOldTorrentFiles from "~/services/delete-old-torrent-files.js";

// Every 8 hour
schedule("0 */8 * * *", async () => {
  console.log(`${time(new Date())}: [cron (start)] update-movies`);
  await updateMovies();
  console.log(`${time(new Date())}: [cron (end)] update-movies`);
});
// Every 6 hours
schedule("0 */6 * * *", async () => {
  console.log(`${time(new Date())}: [cron (start)] delete-old-torrent-files`);
  await deleteOldTorrentFiles();
  console.log(`${time(new Date())}: [cron (end)] delete-old-torrent-files`);
});
