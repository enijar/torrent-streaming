import database from "../src/services/database.js";
import updateMovies from "../src/services/update-movies.js";

// Initialize database connection
await database.sync();
console.log("Database connected");

await updateMovies();
console.log("Update complete!");
process.exit(0);
