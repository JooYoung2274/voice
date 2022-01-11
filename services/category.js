const { Category } = require("../models");

const getCtryByCtry = async ({ category }) => {
  const findedCategory = await Category.findOne({ where: { category } });
  return findedCategory;
};

module.exports = { getCtryByCtry };
