import * as path from "path";
import User from "./entities/user";
import Stream from "./entities/stream";

const paths = {
  emails: path.resolve(__dirname, "emails"),
  data: path.resolve(__dirname, "..", "data"),
};

export default {
  port: process.env.PORT,
  apiUrl: process.env.API_URL,
  appUrl: process.env.APP_URL,
  corsOrigins: process.env.CORS_ORIGINS.split(","),
  bcryptRounds: process.env.BCRYPT_ROUNDS,
  paths,
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    dialect: process.env.DATABASE_DIALECT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    storage: process.env.DATABASE_STORAGE,
    entities: [User, Stream],
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  email: {
    preview: process.env.EMAIL_PREVIEW,
    send: process.env.EMAIL_SEND,
    from: process.env.EMAIL_FROM,
    templates: paths.emails,
    transport: {
      host: process.env.EMAIL_SMTP_HOST,
      port: process.env.EMAIL_SMTP_PORT,
      auth: {
        user: process.env.EMAIL_SMTP_USERNAME,
        pass: process.env.EMAIL_SMTP_PASSWORD,
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
