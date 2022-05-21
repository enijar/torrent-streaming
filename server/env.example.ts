import * as path from "path";
import { Dialect } from "sequelize";

export default {
  port: 3000,
  apiUrl: "http://localhost:3000",
  appUrl: "http://localhost:8080",
  corsOrigins: ["http://localhost:8080"],
  bcryptRounds: 12,
  database: {
    host: `localhost`,
    name: `app`,
    dialect: `sqlite` as Dialect,
    username: `app`,
    password: `secret`,
    storage: path.resolve(__dirname, ".cache", "database.sqlite"),
  },
  jwt: {
    secret: `secret`,
  },
  email: {
    preview: true,
    send: false,
    from: `hello@example.com`,
    smtp: {
      host: `smtp.sendgrid.net`,
      port: 587,
      username: `apikey`,
      password: `secret`,
    },
  },
};
