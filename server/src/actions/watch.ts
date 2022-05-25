import type { Response } from "express";
import * as WebTorrent from "webtorrent";
import * as parseTorrent from "parse-torrent";
import * as rangeParser from "range-parser";
import * as pump from "pump";
import type { PrivateRequest } from "../types";
import Stream from "../entities/stream";
import config from "../config";

type CacheData = {
  stream: Stream;
  file: WebTorrent.TorrentFile;
};

const cache = new Map<string, CacheData>();

const client = new WebTorrent();

export default async function watch(req: PrivateRequest, res: Response) {
  const { uuid } = req.params ?? {};
  const cachedData = cache.get(uuid) ?? null;

  let file: WebTorrent.TorrentFile = null;

  if (cachedData === null) {
    const stream = await Stream.findByPk(uuid);

    if (stream === null) {
      return res.status(404).end();
    }

    let torrentHash: string = stream.torrents?.[0]?.hash ?? null;
    for (let i = 0, length = stream.torrents.length; i < length; i++) {
      const torrent = stream.torrents[i];
      if (torrent.type === "web" || torrent.quality === "1080p") {
        torrentHash = torrent.hash;
        break;
      }
    }

    const parsedLink = parseTorrent(stream.torrents[0].hash);
    const magnetUri = parseTorrent.toMagnetURI({
      ...parsedLink,
      announce: [...parsedLink.announce, ...config.torrentTrackers],
    });

    file = await new Promise((resolve) => {
      client.add(magnetUri, (torrent) => {
        const file = torrent.files.find((file) => file.name.endsWith(".mp4"));
        resolve((file ?? null) as WebTorrent.TorrentFile);
      });
    });

    if (file === null) {
      return res.status(404).end();
    }

    cache.set(stream.uuid, { stream, file });
  } else {
    const cachedData = cache.get(uuid);
    file = cachedData.file;
  }

  res.attachment(file.name);
  res.setHeader("Accept-Ranges", "bytes");

  const headerRange = req.headers.range;
  const fileSize = file.length;

  const parsedRange = headerRange ? rangeParser(fileSize, headerRange) : null;
  const range = parsedRange instanceof Array ? parsedRange[0] : null;

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

  pump(file.createReadStream(range), res, () => {
    file.deselect();
  });
}
