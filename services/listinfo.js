const { Category, Tag, TrackThumbnail } = require("../models");
const { Op } = require("sequelize");

const getCategories = async () => {
  const category = await Category.findAll({
    attributes: ["category", "categoryUrl", "categoryText"],
    where: { category: { [Op.ne]: "전체" } },
  });
  const category_all = await Category.findOne({
    attributes: ["category", "categoryUrl", "categoryText"],
    where: { category: "전체" },
  });
  category.unshift(category_all);
  if (!category) {
    throw customizedError("기본 카테고리 목록이 없습니다.", 400);
  }
  return category;
};

const getTags = async () => {
  const tags = await Tag.findAll({
    attributes: ["tag"],
  });

  if (!tags) {
    throw customizedError("기본 테그 목록이 없습니다.", 400);
  }
  return tags;
};

const getTrackThumbnails = async () => {
  const trackThumbnails = await TrackThumbnail.findAll({
    attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"],
  });

  if (!trackThumbnails) {
    throw customizedError("기본 이모티콘 목록이 없습니다.", 400);
  }
  return trackThumbnails;
};

module.exports = { getCategories, getTags, getTrackThumbnails };
