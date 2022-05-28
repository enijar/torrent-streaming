import config from "./config";
import database from "./services/database";
import cron from "./services/cron";
import app from "./services/app";

(async () => {
  try {
    await database.sync({ alter: true });

    cron();

    app.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
