import { Model, DataTypes } from "@sequelize/core";
import { sequelize } from "../config/db";
import { User } from "./users";

export class Event extends Model {
  declare id: number;
  declare title: string;
  declare description: string;
  declare date: Date;
  declare createdBy: number;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Event",
    timestamps: false,
  }
);
