import * as path from "node:path";
import * as url from "node:url";
import { config } from "dotenv";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paths = {
  root: path.resolve(__dirname, ".."),
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
  jwt: {
    secret: process.env.JWT_SECRET ?? "secret",
  },
  email: {
    password: process.env.EMAIL_SMTP_PASSWORD ?? "secret",
    from: process.env.EMAIL_FROM ?? "hello@example.com",
  },
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
};
