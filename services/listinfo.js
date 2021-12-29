const { Category, Tag, TrackThumbnail } = require("../models");

const getCategories = async () => {
  const category = await Category.findAll({
    attributes: ["category", "categoryUrl"],
  });

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
