import WebTorrent from "webtorrent";
import torrentClient from "~/services/torrent-client.js";
import config from "~/config.js";

const torrentServer = torrentClient.createServer({} as WebTorrent.NodeServerOptions) as WebTorrent.NodeServer;

// @ts-expect-error
torrentServer.server.listen(config.webtorrent.port);

// @ts-expect-error
torrentServer.server.on("listening", () => {
  console.log(`Torrent server running on http://localhost:${config.webtorrent.port}`);
});

// @ts-expect-error
torrentServer.server.on("error", (err: Error) => {
  console.error("Torrent server error:", err);
});
