import { init } from "./services/database.ts";
import updateMovies from "./services/update-movies.ts";
import addAuthorisedEmail from "./services/add-authorised-email.ts";

init()
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
      default:
        console.error(`No command found: ${command}`);
        process.exit(1);
    }

    process.exit(1);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
