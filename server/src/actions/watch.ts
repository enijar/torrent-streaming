import type { Response } from "express";
import * as WebTorrent from "webtorrent";
import * as rangeParser from "range-parser";
import * as pump from "pump";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";
import torrent from "../services/torrent";
import User from "../entities/user";

type CacheData = {
  stream: Stream;
  file: WebTorrent.TorrentFile;
  updatedAt: number;
};

const CACHE_TIME = 20 * 60 * 1000; // 20 mins

const cache = new Map<string, CacheData>();

const client = new WebTorrent();

async function addStreamToUserWatchList(uuid: string, user: User) {
  const streams = user?.streams ?? [];
  if (!streams.includes(uuid)) {
    await user.update({ streams: [...streams, uuid] });
  }
}

export default async function watch(req: PrivateRequest, res: Response) {
  const { uuid } = req.params ?? {};
  let cachedData = cache.get(uuid) ?? null;

  const now = Date.now();

  await addStreamToUserWatchList(uuid, req.user);

  // Update cache
  if (cachedData !== null && now - cachedData.updatedAt >= CACHE_TIME) {
    const stream = await Stream.findByPk(uuid);
    cachedData.stream = stream;
    cachedData.file = await torrent.findFile(client, stream);
    cachedData.updatedAt = now;
    cache.set(uuid, cachedData);
  }

  // Create cache
  if (cachedData === null) {
    const stream = await Stream.findByPk(uuid);
    if (stream === null) {
      return res.status(404).end();
    }

    const file = await torrent.findFile(client, stream);
    if (file === null) {
      return res.status(404).end();
    }

    cache.set(stream.uuid, { stream, file, updatedAt: Date.now() });
    cachedData = cache.get(stream.uuid);
  }

  const headerRange = req.headers.range;
  const fileSize = cachedData.file.length;
  const parsedRange = headerRange ? rangeParser(fileSize, headerRange) : null;
  const range = Array.isArray(parsedRange) ? parsedRange[0] : null;

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Length", fileSize);
  res.statusCode = 200;

  if (range !== null) {
    const bytes = `bytes ${range.start}-${range.end}/${fileSize}`;
    res.statusCode = 206;
    res.setHeader("Content-Range", bytes);
  }

  if (req.method === "HEAD") {
    return res.end();
  }

  pump(cachedData.file.createReadStream(range), res, () => {
    cachedData.file.deselect();
  });
}
