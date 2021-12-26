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
      Track.hasMany(models.Comments, { foreignKey: "trackId" });
      Track.hasMany(models.Likes, { foreignKey: "trackId" });
      Track.belongsTo(models.Users, { foreignKey: "userId" });
      Track.belongsTo(models.Category, { foreignKey: "category" });
      Track.belongsTo(models.TrackThumbnail, { foreignKey: "trackThumbnailUrl" });
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
      timestamps: false,
    },
  );
  return Track;
};
