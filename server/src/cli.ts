import { init } from "./services/database";
import updateMovies from "./services/update-movies";
import addAuthorisedEmail from "./services/add-authorised-email";

(async () => {
  try {
    await init();

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

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
