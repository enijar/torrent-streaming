import type { Context } from "hono";
import { fetch } from "undici";
import agent from "~/services/agent.js";

export default async function ytsProxy(ctx: Context) {
  const url = new URL("https://img.yts.lt");
  url.pathname = ctx.req.param("url") ?? "/";
  const response = await fetch(url, { dispatcher: agent });
  return new Response(Buffer.from(await response.arrayBuffer()), {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "",
    },
  });
}
