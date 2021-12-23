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
      // userId: {
      // allowNull: false,
      //   type: Sequelize.INTEGER,
      // },
      trackUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      script: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      // likeCnt: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      // },
      // viewCnt: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      // },
      thumbnailUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: "Track",
    },
  );
  return Track;
};
