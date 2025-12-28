import WebTorrent from "webtorrent";
import Stream from "~/entities/stream.js";
import config from "~/config.js";

const MAX_QUALITY = 1080;

async function findVideoFile(torrent: WebTorrent.Torrent, maxIterations = 10, iterationTimeout = 1000, iterations = 0) {
  if (iterations >= maxIterations) {
    return null;
  }
  for (const file of torrent.files) {
    if (file.name.endsWith(".mp4")) {
      return file;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, iterationTimeout));
  return findVideoFile(torrent, maxIterations, iterations, iterations + 1);
}

async function findSubtitleFile(
  torrent: WebTorrent.Torrent,
  maxIterations = 10,
  iterationTimeout = 1000,
  iterations = 0,
) {
  if (iterations >= maxIterations) {
    return null;
  }
  let largest = -1;
  let found: WebTorrent.TorrentFile | null = null;
  for (let i = 0; i < torrent.files.length; i++) {
    const file = torrent.files[i];
    if (!(file.name.endsWith(".srt") || file.name.endsWith(".vtt"))) {
      continue;
    }
    if (file.length >= largest) {
      largest = file.length;
      found = file;
    }
  }
  if (found !== null) {
    return found;
  }
  await new Promise((resolve) => setTimeout(resolve, iterationTimeout));
  return findSubtitleFile(torrent, maxIterations, iterations, iterations + 1);
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
    return [null, null];
  }
  let torrent = client.torrents.find((torrent) => torrent.infoHash === hash) ?? null;
  if (torrent !== null) {
    torrent.files.forEach((file) => file.deselect());
    return [await findVideoFile(torrent), await findSubtitleFile(torrent)];
  }
  torrent = client.add(hash, { path: config.paths.torrents });
  if (torrent === null) {
    return [null, null];
  }
  torrent.files.forEach((file) => file.deselect());
  return [await findVideoFile(torrent), await findSubtitleFile(torrent)];
}
