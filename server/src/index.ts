import config from "./config";
import { init } from "./services/database";
import app from "./services/app";

(async () => {
  try {
    await init();

    app.listen(config.port, () => {
      console.log(`Server running: http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
