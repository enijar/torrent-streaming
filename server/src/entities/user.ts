import { DataTypes, Model, type Optional, Sequelize } from "sequelize";

interface UserAttributes {
  uuid: string;
  email: string;
  loginToken?: string | null;
  streams?: string[];
}

interface UserCreationAttributes extends Optional<UserAttributes, "uuid"> {}

export default class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare uuid: string;
  declare email: string;
  declare loginToken?: string | null;
  declare streams?: string[];

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initialise(sequelize: Sequelize) {
    User.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        loginToken: {
          type: DataTypes.STRING,
        },
        streams: {
          type: DataTypes.JSON,
        },
      },
      {
        sequelize,
        tableName: "users",
        indexes: [
          { name: "users_uuid", unique: true, fields: ["uuid"] },
          { name: "users_email", unique: true, fields: ["email"] },
        ],
      },
    );
  }

  public toJSON<T extends User>(): T {
    const data = { ...this.get() } as Partial<UserAttributes>;
    delete data.loginToken;
    return data as T;
  }
}
