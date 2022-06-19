import { schedule } from "node-cron";
import updateMovies from "./update-movies";
import { time } from "../utils";

export default function cron() {
  // Every hour
  schedule("0 */8 * * *", async () => {
    console.log(`${time(new Date())}: [cron (start)] update-movies`);
    await updateMovies();
    console.log(`${time(new Date())}: [cron (end)] update-movies`);
  });
}
