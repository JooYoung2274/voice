"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tag.hasMany(models.TrackTag, { foreignKey: "tag" });
    }
  }
  Tag.init(
    {
      tag: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );
  return Tag;
};
