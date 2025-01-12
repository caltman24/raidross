import { Sequelize, DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  username: DataTypes.STRING,
  birthday: DataTypes.DATE,
});
