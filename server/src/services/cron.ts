import { schedule } from "node-cron";
import updateMovies from "./update-movies";

export default function cron() {
  // Every hour
  schedule("0 */8 * * *", async () => {
    console.log("[cron (start)] update-movies");
    await updateMovies();
    console.log("[cron (end)] update-movies");
  });
}
