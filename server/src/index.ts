import config from "./config";
import { init } from "./services/database";
import app from "./services/app";
import cron from "./services/cron";

console.log(0);

(async () => {
  try {
    await init();

    cron();

    app.listen(config.port, "0.0.0.0", () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
