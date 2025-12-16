import { Sequelize } from "@sequelize/core";
import { MySqlDialect } from "@sequelize/mysql";
import config from "~/config.js";
import Stream from "~/entities/stream.js";

const database = new Sequelize({
  dialect: MySqlDialect,
  host: config.database.host,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  models: [Stream],
});

export default database;
