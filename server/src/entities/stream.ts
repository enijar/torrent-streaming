import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, sql } from "@sequelize/core";
import { Attribute, Table } from "@sequelize/core/decorators-legacy";

@Table({
  tableName: "streams",
  indexes: [
    { name: "streams_uuid", unique: true, fields: ["uuid"] },
    { name: "streams_apiId", unique: true, fields: ["apiId"] },
    { name: "streams_title", unique: false, fields: ["title"] },
    { name: "streams_year", unique: false, fields: ["year"] },
    { name: "streams_rating", unique: false, fields: ["rating"] },
    { name: "streams_duration", unique: false, fields: ["duration"] },
    { name: "streams_genres", unique: false, fields: ["genres"] },
    { name: "streams_synopsis", unique: false, fields: ["synopsis"] },
    { name: "streams_youTubeTrailerCode", unique: false, fields: ["youTubeTrailerCode"] },
    { name: "streams_imdbCode", unique: false, fields: ["imdbCode"] },
    { name: "streams_largeCoverImage", unique: false, fields: ["largeCoverImage"] },
    { name: "streams_torrents", unique: false, fields: ["torrents"] },
    { name: "streams_seeds", unique: false, fields: ["seeds"] },
  ],
})
export default class Stream extends Model<InferAttributes<Stream>, InferCreationAttributes<Stream>> {
  @Attribute({ type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: sql.uuidV4 })
  declare uuid: CreationOptional<string>;

  @Attribute({ type: DataTypes.INTEGER, allowNull: false })
  declare apiId: number;

  @Attribute({ type: DataTypes.STRING, allowNull: false })
  declare title: string;

  @Attribute({ type: DataTypes.INTEGER, allowNull: false })
  declare year: number;

  @Attribute({ type: DataTypes.DOUBLE, allowNull: false })
  declare rating: number;

  @Attribute({ type: DataTypes.INTEGER, allowNull: false })
  declare duration: number;

  @Attribute({ type: DataTypes.JSON, allowNull: false, defaultValue: [] })
  declare genres: Array<string>;

  @Attribute({ type: DataTypes.TEXT, allowNull: false })
  declare synopsis: string;

  @Attribute({ type: DataTypes.STRING, allowNull: false })
  declare youTubeTrailerCode: string;

  @Attribute({ type: DataTypes.STRING, allowNull: false })
  declare imdbCode: string;

  @Attribute({ type: DataTypes.STRING, allowNull: false })
  declare largeCoverImage: string;

  @Attribute({ type: DataTypes.JSON, allowNull: false })
  declare torrents: Array<{
    url: string;
    hash: string;
    size: number;
    type: string;
    peers: number;
    seeds: number;
    quality: string;
  }>;

  @Attribute({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare seeds: number;
}
