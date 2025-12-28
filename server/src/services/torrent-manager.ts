import WebTorrent from "webtorrent";

const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

const torrentLastAccess = new Map<string, number>();

export function initializeTorrentManager(client: WebTorrent.Instance) {
  if (typeof client.setMaxListeners === "function") {
    client.setMaxListeners(50);
  }
  const cleanupInterval = setInterval(() => {
    cleanupInactiveTorrents(client);
  }, CLEANUP_INTERVAL);
  cleanupInterval.unref();
}

export function markTorrentAccessed(infoHash: string) {
  torrentLastAccess.set(infoHash, Date.now());
}

export function getOrAddTorrent(
  client: WebTorrent.Instance,
  hash: string,
  options?: WebTorrent.TorrentOptions,
): WebTorrent.Torrent | null {
  const normalizedHash = hash.toLowerCase();
  let torrent = client.torrents.find((t) => t.infoHash === normalizedHash) ?? null;
  if (torrent !== null) {
    markTorrentAccessed(normalizedHash);
    return torrent;
  }
  try {
    torrent = client.add(hash, options);
    if (torrent) {
      markTorrentAccessed(normalizedHash);
    }
    return torrent;
  } catch (err) {
    console.error("[torrent-manager] Error adding torrent:", err);
    return null;
  }
}

function cleanupInactiveTorrents(client: WebTorrent.Instance) {
  const now = Date.now();
  const torrentsToRemove: WebTorrent.Torrent[] = [];
  for (const torrent of client.torrents) {
    const lastAccess = torrentLastAccess.get(torrent.infoHash);
    if (!lastAccess || now - lastAccess > INACTIVITY_TIMEOUT) {
      torrentsToRemove.push(torrent);
    }
  }
  if (torrentsToRemove.length > 0) {
    for (const torrent of torrentsToRemove) {
      try {
        const hash = torrent.infoHash;
        torrentLastAccess.delete(hash);
        torrent.destroy({ destroyStore: true }, (err) => {
          if (err) {
            console.error("[torrent-manager] Error destroying torrent:", hash.substring(0, 8) + "...", err);
          }
        });
      } catch (err) {
        console.error("[torrent-manager] Error during cleanup:", err);
      }
    }
  }
}
