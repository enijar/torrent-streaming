import type { Context } from "hono";

export default async function ytsProxy(ctx: Context) {
  const url = new URL("https://img.yts.lt");
  url.pathname = ctx.req.param("url") ?? "/";
  const response = await fetch(url);
  return new Response(Buffer.from(await response.arrayBuffer()), {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "",
    },
  });
}
