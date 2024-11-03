import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { Server as SocketIOServer } from "socket.io";
import config from "@/config.js";
import login from "@/actions/login.js";
import loginAdmin from "@/actions/login-admin.js";
import loginQr from "@/actions/login-qr.js";
import auth from "@/actions/auth.js";
import loginWithAuthToken from "@/actions/login-with-auth-token.js";
import authenticate from "@/middleware/authenticate.js";
import user from "@/actions/user.js";
import streams from "@/actions/streams.js";
import stream from "@/actions/stream.js";
import watch from "@/actions/watch.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: config.corsOrigins,
    allowMethods: ["GET", "POST", "HEAD"],
    credentials: true,
  }),
);
app.post("/api/login", login);
app.post("/api/login/admin", loginAdmin);
app.get("/api/login/qr/:uuid", loginQr);
app.get("/api/auth", auth);
app.post("/api/login-with-auth-token", loginWithAuthToken);
app.get("/api/user", authenticate(user));
app.get("/api/streams", authenticate(streams));
app.get("/api/stream/:uuid", authenticate(stream));
app.get("/api/watch/:uuid", authenticate(watch));

const server = serve({
  fetch: app.fetch,
  port: config.port,
});

export const socket = new SocketIOServer(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ["GET", "POST", "HEAD"],
    credentials: true,
  },
});

export default server;
