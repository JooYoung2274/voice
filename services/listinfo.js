const { Category, Tag, TrackThumbnail } = require("../models");

const getCategories = async () => {
  const category = await Category.findAll({
    attributes: ["category"],
  });

  if (!category) {
    return;
  }
  return category;
};

const getTags = async () => {
  const tags = await Tag.findAll({
    attributes: ["tag"],
  });

  if (!tags) {
    return;
  }
  return tags;
};

const getTrackThumbnails = async () => {
  const trackThumbnails = await TrackThumbnail.findAll({
    attributes: ["trackThumbnailUrl"],
  });

  if (!trackThumbnails) {
    return;
  }
  return trackThumbnails;
};

module.exports = { getCategories, getTags, getTrackThumbnails };
