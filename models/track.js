"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Track.hasMany(models.TrackTag, { foreignKey: "trackId" });
      Track.hasMany(models.Comment, { foreignKey: "trackId" });
      Track.hasMany(models.Like, { foreignKey: "trackId" });
      Track.belongsTo(models.Users, { foreignKey: "userId", onDelete: "cascade" });
      Track.belongsTo(models.Category, { foreignKey: "category", onDelete: "cascade" });
      Track.belongsTo(models.TrackThumbnail, {
        foreignKey: "trackThumbnailUrl",
        onDelete: "cascade",
      });
    }
  }
  Track.init(
    {
      trackId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trackUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      trackThumbnailUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: "Track",
    },
  );
  return Track;
};
