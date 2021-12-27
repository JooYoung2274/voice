"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Users.hasMany(models.Comment, {
        foreignKey: "userId",
        sourceKey: "userId",
        onDelete: "cascade",
      });
      models.Users.hasMany(models.Track, {
        foreignKey: "userId",
        sourceKey: "userId",
        onDelete: "cascade",
      });
      models.Users.hasMany(models.Like, {
        foreignKey: "userId",
        sourceKey: "userId",
        onDelete: "cascade",
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      snsId: {
        type: Sequelize.STRING,
      },
      nickname: {
        type: Sequelize.STRING,
      },
      flatformType: {
        type: Sequelize.STRING,
      },
      profileImage: {
        type: Sequelize.STRING,
      },
      contact: {
        type: Sequelize.STRING,
      },
      introduce: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      timstamps: true,
      modelName: "User",
    },
  );
  return User;
};
