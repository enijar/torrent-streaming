import type { Context } from "hono";
import Stream from "../entities/stream.ts";

export default async function stream(ctx: Context) {
  const uuid = ctx.req.param("uuid") ?? "";
  const stream = await Stream.findByPk(uuid, {
    attributes: ["uuid", "title", "year", "rating", "synopsis", "youTubeTrailerCode", "imdbCode", "largeCoverImage"],
  });

  if (stream === null) {
    ctx.status(404);
    return ctx.json({ errors: { server: "Stream not found" } });
  } else {
    return ctx.json({ data: { stream: stream } });
  }
}
