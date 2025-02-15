import type { Context } from "hono";

export default async function ytsProxy(ctx: Context) {
  const url = new URL("https://img.yts.mx");
  url.pathname = ctx.req.param("url") ?? "/";
  return fetch(url);
}
