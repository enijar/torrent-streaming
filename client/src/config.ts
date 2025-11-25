export default {
  env: import.meta.env.MODE ?? "production",
  apiUrl: `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ""}`,
};
