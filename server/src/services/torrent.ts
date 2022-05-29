import * as WebTorrent from "webtorrent";
import * as parseTorrent from "parse-torrent";
import Stream from "../entities/stream";
import config from "../config";

const torrent = {
  findFile(
    client: WebTorrent.Instance,
    stream: Stream
  ): Promise<WebTorrent.TorrentFile> {
    return new Promise(async (resolve) => {
      const parsedLink = parseTorrent(stream.torrents[0].hash);
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
