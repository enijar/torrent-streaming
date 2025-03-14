import WebTorrent from "webtorrent";
import Stream from "~/entities/stream.js";
import config from "~/config.js";

const MAX_QUALITY = 1080;

async function findFile(torrent: WebTorrent.Torrent, maxWaitTime = 10000, iterationTimeout = 50, iterations = 0) {
  if (iterationTimeout * iterations > maxWaitTime) {
    return null;
  }
  for (const file of torrent.files) {
    if (file.name.endsWith(".mp4")) {
      return file;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, iterationTimeout));
  return findFile(torrent, maxWaitTime, ++iterations);
}

export default async function streamToFile(client: WebTorrent.Instance, stream: Stream) {
  const findHash = (type: "web" | "bluray" = "web") => {
    let hash: string | null = null;
    let highestQuality = 0;
    for (const torrent of stream.torrents) {
      const quality = parseInt(torrent.quality);
      if (torrent.type === type && quality > highestQuality && quality <= MAX_QUALITY) {
        hash = torrent.hash;
        highestQuality = quality;
      }
    }
    if (hash === null) {
      return null;
    }
    return hash.toLowerCase();
  };
  let hash = findHash("web");
  if (hash === null) {
    hash = findHash("bluray");
  }
  if (hash === null) {
    return null;
  }
  let torrent = client.torrents.find((torrent) => torrent.infoHash === hash) ?? null;
  if (torrent !== null) {
    return findFile(torrent);
  }
  torrent = client.add(hash, { path: config.paths.torrents });
  if (torrent === null) {
    return null;
  }
  return findFile(torrent);
}
