import { Model, DataTypes } from '@sequelize/core';

import { sequelize } from '@config/index';

export class RevokedToken extends Model {
  declare token: string;
  declare expiresAt: Date;
}

RevokedToken.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RevokedToken',
    timestamps: false,
  },
);
