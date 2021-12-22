const { Category } = require("../models/index");

const findModel = async (input) => {
  const selectedCategory = await Category.findOne({
    attributes: ["categoryId"],
    where: { category: input },
  });
  const catergoryId = selectedCategory.categoryId;
  return catergoryId;
};

module.exports = { findModel };
