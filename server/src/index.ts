import database from "./services/database.ts";
import config from "./config.ts";
import "./services/server.ts";

database
  .sync({ alter: true })
  .then(() => {
    console.log(`Server is running on http://localhost:${config.port}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
