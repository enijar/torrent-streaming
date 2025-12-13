import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Server as SocketIOServer } from "socket.io";
import config from "~/config.js";
import streams from "~/actions/streams.js";
import stream from "~/actions/stream.js";
import watch from "~/actions/watch.js";
import ytsProxy from "~/actions/yts-proxy.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: config.corsOrigins,
    allowMethods: ["GET", "POST", "HEAD"],
    credentials: true,
  }),
);
app.get("/api/streams", streams);
app.get("/api/stream/:uuid", stream);
app.get("/api/watch/:uuid", watch);
app.get("/api/yts/:url", ytsProxy);

const server = serve({
  fetch: app.fetch,
  port: config.port,
});

server.on("listening", () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});

export const socket = new SocketIOServer(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ["GET", "POST", "HEAD"],
    credentials: true,
  },
});

export default server;
