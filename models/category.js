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
      Category.hasMany(models.Track, { foreignKey: "categoryId" });
      Category.hasMany(models.TrackTag, { foreignKey: "categoryId" });
    }
  }
  Category.init(
    {
      categoryId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
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
    },
  );
  return Category;
};
