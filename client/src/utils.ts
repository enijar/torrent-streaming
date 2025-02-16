import config from "@/config.ts";

export function asset(src: string) {
  const url = new URL(src);
  // `${config.apiUrl}/api/yts`
  const urlParam = encodeURIComponent(
    src.replace(`${url.protocol}//${url.host}`, ""),
    // .replace("/assets/images/movies/", "/movies/poster/")
    // .replace(/_/g, "-")
    // .replace("/large-cover.", "."),
  );
  return `${config.apiUrl}/api/yts/${urlParam}`;
}
