"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Users.hasMany(models.Comments, {
        foreignKey: "userId",
        sourceKey: "userId",
        onDelete: "cascade",
      });
      models.Users.hasMany(models.Track, {
        foreignKey: "userId",
        sourceKey: "userId",
        onDelete: "cascade",
      });
      models.Users.hasMany(models.Likes, {
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
      email: {
        type: Sequelize.STRING,
      },
      profileImage: {
        type: Sequelize.STRING,
      },
      nickUnChanged: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      underscored: false, //_사용 여부
      modelName: "Users", //js에서사용
      tableName: "Users", //db에서 사용
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );
  return Users;
};
