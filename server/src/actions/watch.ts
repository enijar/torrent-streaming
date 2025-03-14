import type { Context } from "hono";
import { stream } from "hono/streaming";
import WebTorrent from "webtorrent";
import Stream from "~/entities/stream.js";
import User from "~/entities/user.js";
import streamToFile from "~/services/stream-to-file.js";

const CHUNK_SIZE = 10 ** 6; // 1MB

const client = new WebTorrent();

export default async function watch(ctx: Context, user: User) {
  try {
    if (ctx.req.method === "HEAD") {
      ctx.status(200);
      return ctx.body(null);
    }

    const uuid = ctx.req.param("uuid") ?? "";
    const streamRecord = await Stream.findByPk(uuid);
    if (!streamRecord) {
      ctx.status(404);
      return ctx.text("404");
    }

    // Add stream to user's watch list if needed
    const streams = user?.streams ?? [];
    if (!streams.includes(uuid)) {
      await user.update({ streams: [...streams, uuid] });
    }

    const file = await streamToFile(client, streamRecord);
    if (file === null) {
      ctx.status(404);
      return ctx.text("Stream not found");
    }
    const range = ctx.req.header("range");
    if (range === undefined) {
      ctx.status(400);
      return ctx.text("Missing range header");
    }
    const [start, end] = range
      .replace(/bytes=/, "")
      .split("-")
      .map(Number);
    const rangeStart = start || 0;
    const rangeEnd =
      end && !isNaN(end) ? Math.min(end, file.length - 1) : Math.min(rangeStart + CHUNK_SIZE, file.length - 1);
    const contentLength = rangeEnd - rangeStart + 1;
    ctx.status(206);
    ctx.header("Content-Range", `bytes ${rangeStart}-${rangeEnd}/${file.length}`);
    ctx.header("Accept-Ranges", "bytes");
    ctx.header("Content-Length", contentLength.toString());
    ctx.header("Content-Type", "video/mp4");
    return stream(ctx, async (streamController) => {
      const fileStream = file.createReadStream({
        start: rangeStart,
        end: rangeEnd,
      });
      for await (const chunk of fileStream) {
        await streamController.write(chunk);
      }
      await streamController.close();
    });
  } catch (err) {
    console.error(err);
    ctx.status(500);
    return ctx.text("Server Error");
  }
}
