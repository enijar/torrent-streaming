import { Sequelize } from "sequelize-typescript";
import config from "../config";

const database = new Sequelize({
  host: config.database.host,
  database: config.database.name,
  dialect: config.database.dialect,
  username: config.database.username,
  password: config.database.password,
  storage: config.database.storage,
  logging: false,
  models: config.database.entities,
});

export async function init() {
  await database.sync({ alter: true });
}

export default database;
