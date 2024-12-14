import { Readable } from "node:stream";
import type { Context } from "hono";
import WebTorrent from "webtorrent";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import rangeParser from "range-parser";
import Stream from "@/entities/stream.js";
import User from "@/entities/user.js";
import config from "@/config.js";

const MAX_QUALITY = 1080;
const client = new WebTorrent();

export default async function watch(ctx: Context, user: User) {
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

  let hash: string | null = null;
  let highestQuality = 0;

  for (const torrent of streamRecord.torrents) {
    const quality = parseInt(torrent.quality);
    if (torrent.type === "web" && quality > highestQuality && quality <= MAX_QUALITY) {
      hash = torrent.hash;
      highestQuality = quality;
    }
  }

  if (!hash) {
    ctx.status(404);
    return ctx.text("Stream not found");
  }

  const parsedLink = await parseTorrent(hash);
  const magnetUri = toMagnetURI({
    ...parsedLink,
    announce: [...(parsedLink.announce ?? []), ...config.torrentTrackers],
  });

  if (!magnetUri) {
    ctx.status(404);
    return ctx.text("Magnet URI not found");
  }

  try {
    const rangeHeader = ctx.req.header("Range") ?? "";

    const findFile = (files) => files.find((file) => file.type === "video/mp4") ?? null;

    let torrent = await client.get(magnetUri);
    if (!torrent) {
      torrent = await new Promise((resolve, reject) => {
        client.add(magnetUri, { path: config.paths.torrents }, (t) => {
          resolve(t);
        });
      });
    }

    if ((torrent!.files ?? []).length === 0) {
      ctx.status(404);
      return ctx.text("Video file not found");
    }

    const file = findFile(torrent!.files);
    if (!file) {
      ctx.status(404);
      return ctx.text("Video file not found");
    }

    const ranges = rangeParser(file.length, rangeHeader);
    if (ranges === -1 || ranges === -2 || ranges.length === 0) {
      ctx.status(416); // Range Not Satisfiable
      return ctx.text("Range Not Satisfiable");
    }

    const range = ranges[0];
    const readStream = file.createReadStream(range) as Readable;
    let cleanupCalled = false;

    const cleanup = () => {
      if (cleanupCalled) return;
      cleanupCalled = true;
      readStream.destroy();
      // Destroy or remove the torrent after use if you don't need it
      // This helps avoid accumulating resources.
      torrent!.destroy();
    };

    if (ctx.req.raw.signal) {
      // If the client aborts, cleanup
      ctx.req.raw.signal.addEventListener("abort", () => {
        cleanup();
      });
    }

    const webReadable = new ReadableStream({
      start(controller) {
        const onData = (chunk: Buffer) => {
          try {
            controller.enqueue(chunk);
          } catch (err) {
            cleanup();
          }
        };

        const onEnd = () => {
          controller.close();
          cleanup();
        };

        const onError = (err: Error) => {
          controller.error(err);
          cleanup();
        };

        const onClose = () => {
          // If the underlying stream closes prematurely, cleanup
          cleanup();
        };

        readStream.on("data", onData);
        readStream.on("end", onEnd);
        readStream.on("error", onError);
        readStream.on("close", onClose);
      },
      cancel() {
        cleanup();
      },
    });

    const contentLength = range.end - range.start + 1;

    return new Response(webReadable, {
      status: 206,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4",
        "Content-Length": `${contentLength}`,
        "Content-Range": `bytes ${range.start}-${range.end}/${file.length}`,
      },
    });
  } catch (err) {
    console.error(err);
    ctx.status(500);
    return ctx.text("Server Error");
  }
}
