import type { Context } from "hono";
import WebTorrent, { NodeServer } from "webtorrent";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import Stream from "@/entities/stream.js";
import User from "@/entities/user.js";
import config from "@/config.js";

const MAX_QUALITY = 1080;
const client = new WebTorrent();
const server = client.createServer({}) as NodeServer;
// @ts-expect-error
server.server.listen(config.webtorrent.port);

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
    const findFile = (files) => files.find((file) => file.type === "video/mp4") ?? null;

    let torrent = await client.get(magnetUri);
    if (!torrent) {
      torrent = await new Promise((resolve) => {
        client.add(magnetUri, { path: config.paths.torrents }, (t) => {
          resolve(t);
        });
      });
    }
    if (!torrent) {
      ctx.status(404);
      return ctx.text("Torrent not found");
    }
    const file = findFile(torrent.files);
    if (!file) {
      ctx.status(404);
      return ctx.text("File not found");
    }
    return await fetch(`http://0.0.0.0:${config.webtorrent.port}${file.streamURL}`, ctx.req.raw);
  } catch (err) {
    console.error(err);
    ctx.status(500);
    return ctx.text("Server Error");
  }
}
