"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TrackTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TrackTag.belongsTo(models.Track, { foreignKey: "trackId" });
      TrackTag.belongsTo(models.Tag, { foreignKey: "tag" });
      TrackTag.belongsTo(models.Category, { foreignKey: "category" });
    }
  }
  TrackTag.init(
    {
      trackTagId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tag: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      trackId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "TrackTag",
      timestamps: false,
    },
  );
  return TrackTag;
};
