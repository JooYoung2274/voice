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
      User.hasMany(models.Comment, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
      User.hasMany(models.Track, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
      User.hasMany(models.Like, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
      User.hasMany(models.PlayList, {
        foreignKey: "userId",
        sourceKey: "userId",
      });
    }
  }
  User.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      snsId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      flatformType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      profileImage: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      contact: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      introduce: {
        allowNull: true,
        type: Sequelize.STRING(100),
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
