const { Tag, TrackTag } = require("../models");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const getTagIdByTag = async ({ tag }) => {
  let result = [];
  for (let i = 0; i < 3; i++) {
    const findedTag = await Tag.findOne({
      attributes: ["tagId"],
      where: { tag: tag[i] },
    });
    if (!findedTag) {
      continue;
    }
    result.push(findedTag.tagId);
  }
  if (!tagId) {
    return;
  }
  return result;
};

const getTagIdsByTags = async ({ tag1, tag2, tag3 }) => {
  const findedTag = await Tag.findAll({
    attributes: ["tagId"],
    where: {
      tag: {
        [Op.or]: [tag1, tag2, tag3],
      },
    },
  });
  if (!findedTag) {
    return;
  }
  let result = [];
  for (let i = 0; i < findedTag.length; i++) {
    result.push(findedTag[i].tagId);
  }
  return result;
};

const getTrackIdsByTag = async ({ tag, category }) => {
  const findedTracks = await TrackTag.findAll({
    attributes: ["trackId"],
    where: {
      tag: {
        [Op.or]: [tag[0], tag[1], tag[2]],
      },
      category: category,
    },
  });
  let tags = [];
  for (let i = 0; i < findedTracks.length; i++) {
    tags.push(findedTracks[i].trackId);
  }
  const set = new Set(tags);
  const result = [...set];
  return result;
};

module.exports = { getTagIdsByTags, getTrackIdsByTag, getTagIdByTag };
