import database from "@/services/database.js";
import config from "@/config.js";
import "@/services/server.js";
import cron from "@/services/cron.js";

database
  .sync({ alter: true })
  .then(() => {
    cron();
    console.log(`Server is running on http://localhost:${config.port}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
