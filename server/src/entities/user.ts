import { Column, DataType, Index, Model, Table } from "sequelize-typescript";

@Table({ tableName: "users" })
export default class User extends Model {
  @Index({ name: "users_uuid", unique: true })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

  @Index({ name: "users_email", unique: true })
  @Column
  email: string;

  @Column
  loginToken: string;

  toJSON<T extends any>(): T {
    const data = super.toJSON<User>();
    delete data.loginToken;
    return data as T;
  }
}
