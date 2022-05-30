import * as WebTorrent from "webtorrent";
import * as parseTorrent from "parse-torrent";
import Stream from "../entities/stream";
import config from "../config";

const MAX_QUALITY = 1080;

const torrent = {
  findFile(
    client: WebTorrent.Instance,
    stream: Stream
  ): Promise<WebTorrent.TorrentFile> {
    return new Promise(async (resolve) => {
      let hash: string = null;
      let highestQuality = 0;
      stream.torrents.forEach((torrent) => {
        const quality = parseInt(torrent.quality);
        if (quality > highestQuality && quality <= MAX_QUALITY) {
          hash = torrent.hash;
          highestQuality = quality;
        }
      });

      if (hash === null) {
        return resolve(null);
      }

      const parsedLink = parseTorrent(hash);
      const magnetUri = parseTorrent.toMagnetURI({
        ...parsedLink,
        announce: [...parsedLink.announce, ...config.torrentTrackers],
      });

      const options: WebTorrent.TorrentOptions = {
        path: config.paths.torrents,
      };

      client.add(magnetUri, options, (torrent) => {
        const file = torrent.files.find((file) => {
          return file.name.endsWith(".mp4");
        });

        resolve((file ?? null) as WebTorrent.TorrentFile);
      });
    });
  },
};

export default torrent;
