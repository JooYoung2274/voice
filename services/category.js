const { Category } = require("../models/index");

const getCategoryId = async ({ category }) => {
  const selectedCategory = await Category.findOne({
    attributes: ["categoryId"],
    where: { category },
  });
  if (!selectedCategory) {
    return;
  }
  const catergoryId = selectedCategory.categoryId;
  return catergoryId;
};

module.exports = { getCategoryId };
