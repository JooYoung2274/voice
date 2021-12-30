"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Track, { foreignKey: "category" });
      Category.hasMany(models.TrackTag, { foreignKey: "category" });
    }
  }
  Category.init(
    {
      category: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      categoryUrl: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      categoryText: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: "Category",
      timestamps: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    },
  );
  return Category;
};
