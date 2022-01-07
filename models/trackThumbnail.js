"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TrackThumbnail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TrackThumbnail.hasMany(models.Track, {
        foreignKey: "trackThumbnailId",
      });
    }
  }
  TrackThumbnail.init(
    {
      trackThumbnailId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trackThumbnailUrlFace: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      trackThumbnailUrlFull: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "TrackThumbnail",
      timestamps: false,
    },
  );
  return TrackThumbnail;
};
