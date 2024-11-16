import type { Context } from "hono";
import WebTorrent from "webtorrent";
import torrentService from "@/services/torrent-service.js";
import Stream from "@/entities/stream.js";
import User from "@/entities/user.js";

const client = new WebTorrent();

export default async function watch(ctx: Context, user: User) {
  const uuid = ctx.req.param("uuid") ?? "";

  const stream = await Stream.findByPk(uuid);
  if (stream === null) {
    ctx.status(404);
    return ctx.text("404");
  }

  // Add stream to user watch list
  const streams = user?.streams ?? [];
  if (!streams.includes(uuid)) {
    await user.update({ streams: [...streams, uuid] });
  }

  const magnetUri = await torrentService.parse(stream.torrents);
  if (magnetUri === null) {
    ctx.status(404);
    return ctx.body(null);
  }

  try {
    const stream = await torrentService.stream(client, magnetUri, ctx.req.header("Range") ?? "");
    if (stream === null || ctx.req.method === "HEAD") {
      ctx.status(200);
      return ctx.body(null);
    }
    return new Response(stream.readStream, {
      status: 206,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4",
        "Content-Length": `${stream.fileSize}`,
        "Content-Range": `bytes ${stream.range.start}-${stream.range.end}/${stream.fileSize}`,
      },
    });
  } catch (err) {
    console.error(err);
    ctx.status(500);
    return ctx.text("server error");
  }
}
