const { TrackTag, Tag } = require("../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { NUMBER } = require("../config/constants");

// 실제 db에 있는 태그만 필터링
const filteringTags = async (tags) => {
  const findedTags = [];
  for (const tag of tags) {
    const findedTag = await Tag.findOne({ where: { tag } });
    if (findedTag) {
      findedTags.push(tag);
    }
  }
  return findedTags;
};

// 태그와 카테고리로 트랙아이디 찾는 함수
const getTrackIdsByTagAndCtryId = async ({ tag, categoryId }) => {
  // 카테고리와 태그로 트랙태그관계 뽑음
  let findedTrackTags = [];
  if (categoryId === NUMBER.CATEGORYALLID) {
    findedTrackTags = await TrackTag.findAll({
      attributes: ["trackId", "tag"],
      where: { tag: { [Op.or]: tag } },
    });
  } else {
    findedTrackTags = await TrackTag.findAll({
      attributes: ["trackId", "tag"],
      where: { tag: { [Op.or]: tag }, categoryId },
    });
  }
  const trackIds = [];
  for (let i = 0; i < findedTrackTags.length; i++) {
    trackIds.push(findedTrackTags[i].trackId);
  }
  const set = new Set(trackIds);
  const results = [...set];

  return results;
};

module.exports = { getTrackIdsByTagAndCtryId, filteringTags };
