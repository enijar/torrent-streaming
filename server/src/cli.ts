import database from "~/services/database.js";
import updateMovies from "~/services/update-movies.js";
import addAuthorisedEmail from "~/services/add-authorised-email.js";

database
  .sync()
  .then(async () => {
    let [, , command, ...args] = process.argv;
    args = args ?? [];

    switch (command) {
      case "add-authorised-email":
        await addAuthorisedEmail(args[0] ?? "");
        break;
      case "update-movies":
        await updateMovies();
        break;
      case "migrate-database":
        await database.sync({ alter: true });
        break;
      default:
        console.error(`No command found: ${command}`);
        process.exit(1);
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
