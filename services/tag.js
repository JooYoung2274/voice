const { TrackTag } = require("../models");

const sequelize = require("sequelize");
const Op = sequelize.Op;

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

module.exports = { getTrackIdsByTag };
