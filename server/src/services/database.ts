import { Sequelize } from "sequelize-typescript";
import config from "../config";
import User from "../entities/user";
import Stream from "../entities/stream";

const database = new Sequelize({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  dialect: config.database.dialect,
  username: config.database.username,
  password: config.database.password,
  storage: config.database.storage,
  logging: false,
  models: [User, Stream],
});

export async function init() {
  // @todo investigate this bug
  // @note have to call alter multiple times due to there being a bug with
  // sequelize inside the Docker container
  await database.sync({ alter: true });
  await Promise.all(
    config.database.entities.map((entity) => {
      return entity.sync({ alter: true });
    })
  );
  await database.sync({ alter: true });
}

export default database;
