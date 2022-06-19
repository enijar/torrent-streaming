import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Torrent } from "../types";

@Table({
  tableName: "streams",
  indexes: [
    { name: "streams_index_apiId", unique: true, fields: ["apiId"] },
    { name: "streams_index_title", fields: ["title"] },
    { name: "streams_index_seeds", fields: ["seeds"] },
  ],
})
export default class Stream extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @Column
  apiId: number;

  @Column
  title: string;

  @Column
  year: number;

  @Column
  rating: number;

  @Column
  duration: number;

  @Column({ type: DataType.JSON })
  genres: string[];

  @Column({ type: DataType.TEXT })
  synopsis: string;

  @Column
  youTubeTrailerCode: string;

  @Column
  imdbCode: string;

  @Column
  largeCoverImage: string;

  @Column({ type: DataType.JSON })
  torrents: Torrent[];

  @Column({ defaultValue: 0 })
  seeds: number;

  toJSON<T extends any>(): T {
    const data = super.toJSON<Stream>();
    return data as T;
  }
}
