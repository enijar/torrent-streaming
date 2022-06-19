import { CDN_URL } from "@/consts";

export function asset(src: string) {
  const url = new URL(src);
  return src.replace(`${url.protocol}//${url.host}`, CDN_URL);
}