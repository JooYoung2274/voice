const sequelize = require("sequelize");
const Op = sequelize.Op;

const { Tag } = require("../models/index");
const { TrackTag } = require("../models/index");
const { Track } = require("../models/track");

// const createModel = async (tagId, trackId) => {
//   await TrackTag.create({ tagId: tagId, trackId: trackId });
//   return;
// };

const getTagId = async ({ tag }) => {
  console.log(tag);
  const findedTag = await Tag.findOne({
    attributes: ["tagId"],
    where: { tag },
  });

  if (!findedTag) {
    return;
  }

  const tagId = findedTag.tagId;
  return tagId;
};

const getTagIds = async (tag1, tag2, tag3) => {
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

  let tagIdArray = [];
  for (let i = 0; i < findedTag.length; i++) {
    tagIdArray.push(findedTag[i].tagId);
  }

  return tagIdArray;
};

const getTrackTag = async (findedTags, categoryId) => {
  let tracksArray = [];
  for (let i = 0; i < findedTags.length; i++) {
    const findedTracks = await TrackTag.findAll({
      attributes: ["trackId"],
      where: { tagId: findedTags[i], categoryId: categoryId },
    });

    if (!findedTracks.length) {
      continue;
    } else {
      for (let j = 0; j < findedTracks.length; j++) {
        tracksArray.push(findedTracks[j].trackId);
      }
    }
  }
  return tracksArray;
};

module.exports = { getTagIds, getTrackTag, getTagId };
