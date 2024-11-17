import { Readable } from "node:stream";
import WebTorrent from "webtorrent";
import rangeParser from "range-parser";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import { Torrent } from "@/types.js";
import config from "@/config.js";

const MAX_QUALITY = 1080;

const torrentService = {
  async parse(torrents: Torrent[]) {
    let hash: string | null = null;
    let highestQuality = 0;
    const web = torrents.some((torrent) => torrent.type === "web");
    for (const torrent of torrents) {
      const quality = parseInt(torrent.quality);
      if (
        (web ? torrent.type === "web" : torrent.type !== "web") &&
        quality > highestQuality &&
        quality <= MAX_QUALITY
      ) {
        hash = torrent.hash;
        highestQuality = quality;
      }
    }
    if (hash === null) {
      return null;
    }
    const parsedLink = await parseTorrent(hash);
    return toMagnetURI({
      ...parsedLink,
      announce: [...(parsedLink.announce ?? []), ...config.torrentTrackers],
    });
  },
  async stream(
    client: WebTorrent.Instance,
    magnetUri: string,
    range: string,
  ): Promise<null | {
    readStream: ReadableStream;
    fileSize: number;
    type: string;
    range: { start: number; end: number };
  }> {
    type File = WebTorrent.TorrentFile & {
      type: string;
    };
    const findFile = (files: File[]) => {
      const file = files.find((file) => {
        return file.type === "video/mp4";
      });
      return file ?? null;
    };
    const torrent = await client.get(magnetUri);
    let file: File | null = null;
    if (torrent) {
      file = findFile(torrent.files as File[]);
    } else {
      const files = await new Promise<File[]>((resolve) => {
        client.add(magnetUri, { path: config.paths.torrents }, (torrent) => {
          resolve(torrent.files as File[]);
        });
      });
      file = findFile(files);
    }
    if (file === null) {
      return null;
    }
    const ranges = rangeParser(file.length, range);
    if (ranges === -1 || ranges === -2) {
      return null;
    }
    return {
      // @ts-expect-error
      readStream: Readable.toWeb(file.createReadStream(ranges[0])),
      fileSize: file.length,
      type: file.type,
      range: ranges[0],
    };
  },
};

export default torrentService;
