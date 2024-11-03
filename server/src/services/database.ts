import * as fs from "node:fs";
import * as path from "node:path";
import { Sequelize } from "sequelize";
import config from "../config.ts";
import User from "../entities/user.ts";
import Stream from "../entities/stream.ts";

const ca = fs.readFileSync(path.join(config.paths.data, "ca-certificate.crt"), "utf-8");

const database = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  dialect: config.database.dialect,
  username: config.database.username,
  password: config.database.password,
  storage: config.database.storage,
  dialectOptions: config.env === "development" ? undefined : { ssl: { ca } },
  logging: false,
});

User.initialise(database);
Stream.initialise(database);

export default database;
