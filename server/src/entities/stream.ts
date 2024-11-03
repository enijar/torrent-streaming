import { DataTypes, Model, type Optional, Sequelize } from "sequelize";
import type { Torrent } from "@/types.js";

interface StreamAttributes {
  uuid: string;
  apiId: number;
  title: string;
  year: number;
  rating: number;
  duration: number;
  genres: string[];
  synopsis: string;
  youTubeTrailerCode: string;
  imdbCode: string;
  largeCoverImage: string;
  torrents: Torrent[];
  seeds: number;
}

export interface StreamCreationAttributes extends Optional<StreamAttributes, "uuid" | "seeds"> {}

export default class Stream extends Model<StreamAttributes, StreamCreationAttributes> implements StreamAttributes {
  declare uuid: string;
  declare apiId: number;
  declare title: string;
  declare year: number;
  declare rating: number;
  declare duration: number;
  declare genres: string[];
  declare synopsis: string;
  declare youTubeTrailerCode: string;
  declare imdbCode: string;
  declare largeCoverImage: string;
  declare torrents: Torrent[];
  declare seeds: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialise(sequelize: Sequelize) {
    Stream.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        apiId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        rating: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        genres: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: "[]",
        },
        synopsis: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        youTubeTrailerCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        imdbCode: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        largeCoverImage: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        torrents: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        seeds: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: "streams",
        indexes: [
          { name: "streams_index_apiId", unique: true, fields: ["apiId"] },
          { name: "streams_index_title", fields: ["title"] },
          { name: "streams_index_seeds", fields: ["seeds"] },
        ],
      },
    );
  }

  public toJSON<T extends Stream>(): T {
    const data = { ...this.get() };
    return data as T;
  }
}
