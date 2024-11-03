import * as path from "node:path";
import * as url from "node:url";
import type { Dialect } from "sequelize";
import { config } from "dotenv";
import User from "@/entities/user.js";
import Stream from "@/entities/stream.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  emails: path.resolve(__dirname, "..", "emails"),
  data: path.resolve(__dirname, "..", "data"),
  torrents: path.resolve(__dirname, "..", "torrents"),
};

config({ path: path.resolve(__dirname, "..", ".env") });

export default {
  env: process.env.NODE_ENV ?? "production",
  port: parseInt(process.env.PORT ?? "3000"),
  apiUrl: process.env.API_URL ?? "http://localhost:3000",
  appUrl: process.env.APP_URL ?? "http://localhost:8080",
  corsOrigins: (process.env.CORS_ORIGINS ?? "").split(","),
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS ?? "12"),
  adminEmail: "$2b$12$t2lW3Nk/o4dod.74P9k6NuXLpereuxqFS2su2WtO1JClUdaixCvWi",
  adminPassword: "$2b$12$VMjsijaCtl3pPiLB5qM/peZ639y0pAGHqhqD7ohWEZRRhbIa/VYLC",
  paths,
  database: {
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT ?? "3306"),
    name: process.env.DATABASE_NAME ?? "torrent-streaming",
    dialect: (process.env.DATABASE_DIALECT ?? "sqlite") as Dialect,
    username: process.env.DATABASE_USERNAME ?? "torrent-streaming",
    password: process.env.DATABASE_PASSWORD ?? "secret",
    storage: process.env.DATABASE_STORAGE ?? ".cache/database.sqlite",
    entities: [User, Stream],
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "secret",
  },
  email: {
    preview: (process.env.EMAIL_PREVIEW ?? "true") === "true",
    send: (process.env.EMAIL_SEND ?? "false") === "true",
    from: process.env.EMAIL_FROM ?? "hello@example.com",
    templates: paths.emails,
    transport: {
      host: process.env.EMAIL_SMTP_HOST ?? "smtp.sendgrid.net",
      port: parseInt(process.env.EMAIL_SMTP_PORT ?? "587"),
      auth: {
        user: process.env.EMAIL_SMTP_USERNAME ?? "apikey",
        pass: process.env.EMAIL_SMTP_PASSWORD ?? "secret",
      },
    },
  },
  torrentTrackers: [
    "udp://tracker.coppersurfer.tk:6969/announce",
    "udp://9.rarbg.to:2920/announce",
    "udp://tracker.opentrackr.org:1337",
    "udp://tracker.internetwarriors.net:1337/announce",
    "udp://tracker.leechers-paradise.org:6969/announce",
    "udp://tracker.pirateparty.gr:6969/announce",
    "udp://tracker.cyberia.is:6969/announce",
  ],
};
