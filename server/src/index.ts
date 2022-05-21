import config from "./config";
import database from "./services/database";
import app from "./services/app";

(async () => {
  try {
    await database.sync({ alter: true });

    app.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
