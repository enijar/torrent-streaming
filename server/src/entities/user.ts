import { Column, DataType, Index, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "users",
  indexes: [
    { name: "users_uuid", unique: true, fields: ["uuid"] },
    { name: "users_email", unique: true, fields: ["email"] },
  ],
})
export default class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  uuid: string;

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
