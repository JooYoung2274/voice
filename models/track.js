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
      Track.belongsTo(models.User, { foreignKey: "userId", onDelete: "cascade" });
      Track.belongsTo(models.Category, { foreignKey: "category", onDelete: "cascade" });
      Track.belongsTo(models.TrackThumbnail, {
        foreignKey: "trackThumbnailUrlFace",
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
      trackThumbnailUrlFace: {
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
    },
    {
      sequelize,
      modelName: "Track",
      timestamps: true,
    },
  );
  return Track;
};
