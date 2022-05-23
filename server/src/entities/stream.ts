import { Column, DataType, Index, Model, Table } from "sequelize-typescript";
import { Torrent } from "../types";

@Table({ tableName: "streams" })
export default class Stream extends Model {
  @Index({ name: "uuid", unique: true })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @Index({ name: "apiId", unique: true })
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
  largeCoverImage: string;

  @Column({ type: DataType.JSON })
  torrents: Torrent[];

  toJSON<T extends any>(): T {
    const data = super.toJSON<Stream>();
    return data as T;
  }
}