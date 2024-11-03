import type { Context } from "hono";
import { stream as streaming } from "hono/streaming";
import * as path from "node:path";
import * as fs from "node:fs";
import WebTorrent from "webtorrent";
import rangeParser from "range-parser";
import torrent from "../services/torrent.ts";
import Stream from "../entities/stream.ts";
import User from "../entities/user.ts";
import config from "../config.ts";

const client = new WebTorrent();

async function addStreamToUserWatchList(uuid: string, user: User) {
  const streams = user.streams ?? [];
  if (!streams.includes(uuid)) {
    await user.update({ streams: [...streams, uuid] });
  }
}

export default async function watch(ctx: Context, user: User) {
  const uuid = ctx.req.param("uuid") ?? "";

  const stream = await Stream.findByPk(uuid);
  if (stream === null) {
    return ctx.status(404);
  }

  const file = await torrent.findFile(client, stream);
  if (file === null) {
    return ctx.status(404);
  }

  const filePath = path.join(config.paths.torrents, file.path);
  const stat = await fs.promises.stat(filePath);
  const fileSize = stat.size;

  const range = ctx.req.header("range");

  if (range === undefined) {
    ctx.status(422);
    return ctx.text("Missing Range header");
  }

  const ranges = rangeParser(fileSize, range);

  if (ranges === -1 || ranges === -2) {
    // Invalid range, Range Not Satisfiable
    ctx.header("Content-Range", `bytes */${fileSize}`);
    return ctx.status(416);
  }

  const { start, end } = ranges[0];

  // Partial Content
  ctx.status(206);
  ctx.header("Content-Range", `bytes ${start}-${end}/${fileSize}`);
  ctx.header("Accept-Ranges", "bytes");
  ctx.header("Content-Length", String(end - start + 1));
  ctx.header("Content-Type", "video/mp4");

  const readStream = fs.createReadStream(filePath, { start, end });

  return streaming(ctx, async (stream) => {
    // Handle stream abortion if needed
    stream.onAbort(() => {
      console.log("Stream aborted");
      readStream.destroy();
    });
    try {
      // Asynchronously iterate over the Node.js Readable stream
      for await (const chunk of readStream) {
        // Write each chunk to the Hono stream
        await stream.write(chunk);
      }
      // Signal that streaming is complete
      await stream.close();
    } catch (err) {
      // Handle any errors during streaming
      console.error(err);
      stream.abort();
    }
  });
}
