import config from "./config";
import { init } from "./services/database";
import { server } from "./services/app";
import cron from "./services/cron";

(async () => {
  try {
    await init();

    cron();

    server.listen(config.port, "0.0.0.0", () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
