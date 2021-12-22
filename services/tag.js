const { Tag } = require("../models/index");
const { TrackTag } = require("../models/index");

const createModel = async (tag, trackId) => {
  const findedTag = await Tag.findOne({
    attributes: ["tagId"],
    where: { tag: tag },
  });
  let tagId;
  if (!findedTag) {
    const createdTag = await Tag.create({ tag: tag });
    tagId = createdTag.tagId;
  } else {
    tagId = findedTag.tagId;
  }

  await TrackTag.create({ tagId: tagId, trackId: trackId });
  return;
};

module.exports = { createModel };
