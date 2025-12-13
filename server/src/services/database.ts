import * as path from "node:path";
import { Sequelize } from "@sequelize/core";
import { SqliteDialect } from "@sequelize/sqlite3";
import config from "~/config.js";
import Stream from "~/entities/stream.js";

const database = new Sequelize({
  dialect: SqliteDialect,
  storage: path.join(config.paths.root, "database.sqlite"),
  models: [Stream],
});

export default database;
