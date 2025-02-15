import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, sql } from "@sequelize/core";
import { Attribute, Table } from "@sequelize/core/decorators-legacy";

@Table({
  tableName: "users",
  indexes: [
    { name: "users_uuid", unique: true, fields: ["uuid"] },
    { name: "users_email", unique: true, fields: ["email"] },
    { name: "users_loginToken", unique: false, fields: ["loginToken"] },
    { name: "users_streams", unique: false, fields: ["streams"] },
  ],
})
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute({ type: DataTypes.UUID, allowNull: false, primaryKey: true, defaultValue: sql.uuidV4 })
  declare uuid: CreationOptional<string>;

  @Attribute({ type: DataTypes.STRING, allowNull: false })
  declare email: string;

  @Attribute({ type: DataTypes.STRING, defaultValue: null })
  declare loginToken: CreationOptional<string> | null;

  @Attribute({ type: DataTypes.JSON, allowNull: false, defaultValue: [] })
  declare streams: CreationOptional<Array<string>>;
}
