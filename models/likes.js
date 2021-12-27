"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Likes.belongsTo(models.Users, { foreignKey: "userId", onDelete: "cascade" });
      Likes.belongsTo(models.Track, { foreignKey: "trackId", onDelete: "cascade" });
    }
  }
  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      trackId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Likes",
    },
  );
  return Likes;
};
