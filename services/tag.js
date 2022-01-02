const { TrackTag } = require("../models");
const { customizedError } = require("../utils/error");
const sequelize = require("sequelize");
const Op = sequelize.Op;

const getTrackIdsByTag = async ({ tag, category }) => {
  if (category === "전체") {
    const findedTrackTags = await TrackTag.findAll({
      attributes: ["trackId", "tag"],
      where: { tag: { [Op.or]: tag } },
    });
    let tags = [];
    for (let i = 0; i < findedTrackTags.length; i++) {
      tags.push(findedTrackTags[i].trackId);
    }
    const set = new Set(tags);
    const result = [...set];

    return result;
  }
  const findedTrackTags = await TrackTag.findAll({
    attributes: ["trackId", "tag"],
    where: { tag: { [Op.or]: tag }, category: category },
  });

  let tags = [];
  for (let i = 0; i < findedTrackTags.length; i++) {
    tags.push(findedTrackTags[i].trackId);
  }
  const set = new Set(tags);
  const result = [...set];

  return result;
};
// const trackIds = {};
// for (const trackTag of findedTrackTags) {
//   const newTrackId = trackTag.dataValues.trackId;
//   trackIds = { ...trackIds };
//   if (!trackIds.newTrackId) {
//     trackIds.trackTag.dataValues.trackId = 0;
//   } else if (trackIds.trackId) {
//     trackIds.trackTag.dataValues.trackId += 1;
//   }
// }

module.exports = { getTrackIdsByTag };
