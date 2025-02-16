import { Model, DataTypes } from "@sequelize/core";
import { sequelize } from "../config/db";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare createdAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "custom_email_unique", // Исправление здесь
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    timestamps: false,
    indexes: [
      {
        name: "custom_email_unique", // Явное задание имени индекса
        unique: true,
        fields: ["email"],
      },
    ],
  }
);
