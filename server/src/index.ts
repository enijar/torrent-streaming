import database from "~/services/database.js";
import "~/services/server.js";

database
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
