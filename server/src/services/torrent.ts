import WebTorrent from "webtorrent";
import parseTorrent, { toMagnetURI } from "parse-torrent";
import Stream from "@/entities/stream.js";
import config from "@/config.js";

const MAX_QUALITY = 1080;

const torrent = {
  download(client: WebTorrent.Instance, stream: Stream) {
    return new Promise(async (resolve) => {
      let hash: string | null = null;
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

      const parsedLink = await parseTorrent(hash);

      const magnetUri = toMagnetURI({
        ...parsedLink,
        announce: [...(parsedLink.announce ?? []), ...config.torrentTrackers],
      });

      const options: WebTorrent.TorrentOptions = {
        path: config.paths.torrents,
      };

      function getFile(torrent: WebTorrent.Torrent): WebTorrent.TorrentFile | null {
        const file = torrent.files.find((file) => {
          return file.name.endsWith(".mp4");
        });

        return (file as WebTorrent.TorrentFile) ?? null;
      }

      const torrent = await client.get(magnetUri);

      if (torrent) {
        return resolve(getFile(torrent));
      }

      client.add(magnetUri, options, (torrent) => {
        const file = getFile(torrent);
        if (file !== null) {
          console.log(file.downloaded);
        }
        resolve(file);
      });
    });
  },
  findFile(client: WebTorrent.Instance, stream: Stream): Promise<WebTorrent.TorrentFile | null> {
    return new Promise(async (resolve) => {
      let hash: string | null = null;
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

      const parsedLink = await parseTorrent(hash);

      if (parsedLink.announce === undefined) {
        return resolve(null);
      }

      const magnetUri = toMagnetURI({
        ...parsedLink,
        announce: [...parsedLink.announce, ...config.torrentTrackers],
      });

      const options: WebTorrent.TorrentOptions = {
        path: config.paths.torrents,
      };

      function getFile(torrent: WebTorrent.Torrent): WebTorrent.TorrentFile | null {
        const file = torrent.files.find((file) => {
          return file.name.endsWith(".mp4");
        });

        return (file as WebTorrent.TorrentFile) ?? null;
      }

      const torrent = await client.get(magnetUri);

      if (torrent) {
        return resolve(getFile(torrent));
      }

      client.add(magnetUri, options, (torrent) => {
        const file = getFile(torrent);
        resolve(file);
      });
    });
  },
};

export default torrent;
