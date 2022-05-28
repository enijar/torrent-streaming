import updateMovies from "../services/update-movies";

(async () => {
  try {
    await updateMovies();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
