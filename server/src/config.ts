import * as path from "node:path";
import * as url from "node:url";
import { config } from "dotenv";
import database from "~/services/database.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  root: path.resolve(__dirname, ".."),
  data: path.resolve(__dirname, "..", "data"),
  torrents: path.resolve(__dirname, "..", "torrents"),
};

config({ path: path.resolve(__dirname, "..", "..", ".env") });

export default {
  env: process.env.NODE_ENV ?? "production",
  port: parseInt(process.env.PORT ?? "3000"),
  apiUrl: process.env.API_URL ?? "http://localhost:3000",
  appUrl: process.env.APP_URL ?? "http://localhost:8080",
  corsOrigins: (process.env.CORS_ORIGINS ?? "").split(","),
  paths,
  webtorrent: {
    port: process.env.WEBTORRENT_PORT ?? "9999",
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
  proxy: {
    host: process.env.PROXY_HOST,
    port: parseInt(process.env.PROXY_PORT ?? "1080"),
    username: process.env.PROXY_USERNAME,
    password: process.env.PROXY_PASSWORD,
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? "3306"),
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
};
