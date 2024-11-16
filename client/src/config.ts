export default {
  env: import.meta.env.MODE ?? "production",
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
};
