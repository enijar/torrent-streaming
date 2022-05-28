import type { Response } from "express";
import * as WebTorrent from "webtorrent";
import * as rangeParser from "range-parser";
import * as pump from "pump";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";
import torrent from "../services/torrent";

type CacheData = {
  stream: Stream;
  file: WebTorrent.TorrentFile;
  updatedAt: number;
};

const CACHE_TIME = 60 * 60 * 1000; // 1 hour

const cache = new Map<string, CacheData>();

const client = new WebTorrent();

export default async function watch(req: PrivateRequest, res: Response) {
  const { uuid } = req.params ?? {};
  let cachedData = cache.get(uuid) ?? null;

  const now = Date.now();

  // Update cache
  if (cachedData !== null && now - cachedData.updatedAt >= CACHE_TIME) {
    const stream = await Stream.findByPk(uuid);
    cachedData.stream = stream;
    cachedData.file = await torrent.findFile(client, stream);
    cachedData.updatedAt = now;
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

  res.attachment(cachedData.file.name);
  res.setHeader("Accept-Ranges", "bytes");

  const headerRange = req.headers.range;
  const fileSize = cachedData.file.length;
  const parsedRange = headerRange ? rangeParser(fileSize, headerRange) : null;
  const range = Array.isArray(parsedRange) ? parsedRange[0] : null;

  if (range !== null) {
    const bytes = `bytes ${range.start}-${range.end}/${fileSize}`;
    res.statusCode = 206;
    res.setHeader("Content-Length", range.end - range.start + 1);
    res.setHeader("Content-Range", bytes);
  } else {
    res.setHeader("Content-Length", fileSize);
  }

  if (req.method === "HEAD") {
    return res.end();
  }

  pump(cachedData.file.createReadStream(range), res, () => {
    cachedData.file.deselect();
  });
}
