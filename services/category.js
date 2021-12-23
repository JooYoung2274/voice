const { Category } = require("../models/index");

const getCategoryId = async ({ newCategory }) => {
  const selectedCategory = await Category.findOne({
    attributes: ["categoryId"],
    where: { category: newCategory },
  });
  if (!selectedCategory) {
    return;
  }
  const catergoryId = selectedCategory.categoryId;
  return catergoryId;
};

module.exports = { getCategoryId };
