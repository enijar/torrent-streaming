import { Readable } from "node:stream";
import type { Context } from "hono";
import WebTorrent from "webtorrent";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import rangeParser from "range-parser";
import Stream from "@/entities/stream.js";
import User from "@/entities/user.js";
import config from "@/config.js";

type File = WebTorrent.TorrentFile & {
  type: string;
};

const MAX_QUALITY = 1080;
const client = new WebTorrent();

export default async function watch(ctx: Context, user: User) {
  if (ctx.req.method === "HEAD") {
    ctx.status(200);
    return ctx.body(null);
  }

  const uuid = ctx.req.param("uuid") ?? "";

  const streamRecord = await Stream.findByPk(uuid);
  if (streamRecord === null) {
    ctx.status(404);
    return ctx.text("404");
  }

  // Add stream to user watch list
  const streams = user?.streams ?? [];
  if (!streams.includes(uuid)) {
    await user.update({ streams: [...streams, uuid] });
  }

  let hash: string | null = null;
  let highestQuality = 0;

  for (const torrent of streamRecord.torrents) {
    const quality = parseInt(torrent.quality);
    // Using only web-type torrent and best quality <= MAX_QUALITY
    if (torrent.type === "web" && quality > highestQuality && quality <= MAX_QUALITY) {
      hash = torrent.hash;
      highestQuality = quality;
    }
  }

  if (hash === null) {
    ctx.status(404);
    return ctx.text("Stream not found");
  }

  const parsedLink = await parseTorrent(hash);
  const magnetUri = toMagnetURI({
    ...parsedLink,
    announce: [...(parsedLink.announce ?? []), ...config.torrentTrackers],
  });

  if (magnetUri === null) {
    ctx.status(404);
    return ctx.text("Magnet URI not found");
  }

  try {
    const rangeHeader = ctx.req.header("Range") ?? "";
    const findFile = (files: File[] = []) => {
      const file = files.find((file) => file.type === "video/mp4");
      return file ?? null;
    };

    let torrent = await client.get(magnetUri);
    let file: File | null;

    if (torrent) {
      file = findFile(torrent.files as File[]);
    } else {
      torrent = await new Promise<WebTorrent.Torrent>((resolve) => {
        client.add(magnetUri, { path: config.paths.torrents }, (torrent) => {
          resolve(torrent);
        });
      });
      file = findFile(torrent.files as File[]);
    }

    if (file === null) {
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

    // Manually convert Node.js Readable to Web ReadableStream with proper cleanup
    const webReadable = new ReadableStream({
      start(controller) {
        const onData = (chunk: Buffer) => {
          try {
            controller.enqueue(chunk);
          } catch (err) {
            // If enqueue fails, cleanup to prevent further calls
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
          // If the stream closes after end/error, just ensure no further events
          cleanup();
        };

        function cleanup() {
          readStream.off("data", onData);
          readStream.off("end", onEnd);
          readStream.off("error", onError);
          readStream.off("close", onClose);
        }

        readStream.on("data", onData);
        readStream.on("end", onEnd);
        readStream.on("error", onError);
        readStream.on("close", onClose);
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
