import * as express from "express";
import { json } from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import * as cors from "cors";
import config from "../config";
import router from "../router";
import cookies from "../middleware/cookies";

const app = express();
export const server = createServer(app);
export const socket = new Server(server, {
  cors: {
    origin: config.corsOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(json());
app.use(
  cors({
    origin(origin, next) {
      if (origin && !config.corsOrigins.includes(origin)) {
        return next(new Error("Not allowed by CORS"));
      }
      next(null, true);
    },
    credentials: true,
  })
);
app.use([cookies, router]);

app.all("*", (req, res) => {
  res.status(404).json({ errors: { server: "Not found" } });
});

export default app;
