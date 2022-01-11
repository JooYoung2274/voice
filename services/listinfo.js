const { Category, Tag, TrackThumbnail } = require("../models");

const getCategories = async () => {
  const categories = await Category.findAll({
    attributes: ["categoryId", "category", "categoryUrl", "categoryText"],
  });
  return categories;
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
    attributes: ["trackThumbnailId", "trackThumbnailUrlFace", "trackThumbnailUrlFull"],
  });

  if (!trackThumbnails) {
    throw customizedError("기본 이모티콘 목록이 없습니다.", 400);
  }
  return trackThumbnails;
};

module.exports = { getCategories, getTags, getTrackThumbnails };
