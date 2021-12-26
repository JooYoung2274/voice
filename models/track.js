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
      Track.belongsTo(models.Category, { foreignKey: "categoryId" });
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
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      trackUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      thumbnailUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
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
