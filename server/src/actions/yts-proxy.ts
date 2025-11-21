import type { Context } from "hono";

export default async function ytsProxy(ctx: Context) {
  const url = new URL("https://yts.lt");
  url.pathname = ctx.req.param("url") ?? "/";
  return fetch(url);
}
