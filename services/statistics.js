const { Track, Like, Category, TrackTag, Tag, User } = require("../models");
const { Op } = require("sequelize");

//해당하는 모든 trackId 찾기
const TrackIdsByUserId = async (userId) => {
  const findedTrackIds = await Track.findAll({
    attributes: ["trackId"],
    where: userId,
  });
  const results = findedTrackIds.map((track) => track.trackId);
  return results;
};
//카테고리별 트랙 아이디 찾기
const TrackIdsByCategory = async (categoryId, userId) => {
  const findedTrackIds = await Track.findAll({
    attributes: ["trackId"],
    where: categoryId,
    userId,
  });
  const results = findedTrackIds.map((track) => track.trackId);
  return results;
};

//전체제외 카테고리 항목 아이디
const getCategorys = async () => {
  const categoryList = await Category.findAll({
    attributes: ["categoryId"],
    where: { category: { [Op.ne]: "전체" } },
    order: [["categoryId", "ASC"]],
  });
  const results = categoryList.map((el) => el.categoryId);
  return results;
};
//카테고리 아이디로 카테고리 이름 찾기
const getCategoryByCategoryId = async (categoryId) => {
  const findedCategory = await Category.findOne({
    attributes: ["category"],
    where: { categoryId },
  });
  const result = findedCategory.category;
  return result;
};
//모든 태그 항목
const getTags = async () => {
  const tagList = await Tag.findAll({ attributes: ["tag"] });
  const results = tagList.map((el) => el.tag);
  return results;
};
//모든 유저의 userId
const getUsers = async () => {
  const userList = await User.findAll({ attributes: ["userId"], order: [["userId", "ASC"]] });
  const results = userList.map((el) => el.userId);
  return results;
};
//1순위 카테고리와 1~3순위 태그들
const getCategoryTags = async ({ userId }) => {
  const categorysCount = [];
  const tagsCount = [];
  //userId가 올린 모든 트랙의 트랙 아이디 찾기
  const findedTrackIds = await TrackIdsByUserId({ userId });
  if (findedTrackIds.length === 0) {
    return { category: "", tags: "" };
  }
  //전체제외 카테고리 항목
  const categoryList = await getCategorys();

  //카테고리 항목 별로 userId가 올린 카테고리 세기
  for (let categoryId of categoryList) {
    const findedCategoryCount = await Track.count({
      where: { userId, categoryId },
    });
    //카테고리별 트랙 아이디 찾기
    const trackIdsByCategory = await TrackIdsByCategory({ categoryId, userId });
    if (trackIdsByCategory.length === 0) {
      categorysCount.push({ category: categoryId, count: findedCategoryCount, likeCnt: 0 });
    } else {
      //카테고리별 좋아요 세기
      const likeByCategoryCount = await Like.count({
        where: { trackId: { [Op.or]: trackIdsByCategory } },
      });
      categorysCount.push({
        category: categoryId,
        count: findedCategoryCount,
        likeCnt: likeByCategoryCount,
      });
    }
  }
  //개수 많은 순 정렬(같으면 좋아요 많은순)
  categorysCount.sort((a, b) => {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    if (a.count === b.count) {
      if (a.likeCnt > b.likeCnt) return -1;
      if (a.likeCnt < b.likeCnt) return 1;
      return 0;
    }
  });
  const maxCategoryId = categorysCount[0].category;
  //카테고리 아이디로 해당 카테고리 찾기
  const findedMaxCategory = await getCategoryByCategoryId(maxCategoryId);
  //모든 태그 항목
  const tagList = await getTags();
  //userId가 올린 트랙의 태그를 태그 항목별 세기
  for (let tag of tagList) {
    const findedTagCount = await TrackTag.count({
      where: { trackId: { [Op.or]: findedTrackIds }, tag: tag },
    });
    //태그별 트랙 아이디 찾기
    const trackIdsByTag = await TrackTag.findAll({
      attributes: ["trackId"],
      where: { trackId: { [Op.or]: findedTrackIds }, tag: tag },
    });
    const trackIds = trackIdsByTag.map((track) => track.trackId);
    if (trackIds.length === 0) {
      tagsCount.push({ tag: tag, count: findedTagCount, likeCnt: 0 });
    } else {
      //태그별 좋아요 세기
      const likeByTagCount = await Like.count({
        where: { trackId: { [Op.or]: trackIds } },
      });
      tagsCount.push({ tag: tag, count: findedTagCount, likeCnt: likeByTagCount });
    }
  }
  tagsCount.sort((a, b) => {
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    if (a.count === b.count) {
      if (a.likeCnt > b.likeCnt) return -1;
      if (a.likeCnt < b.likeCnt) return 1;
      return 0;
    }
  });
  //console.log(tagsCount);
  //console.log(categorysCount);
  const maxTreeTags = [tagsCount[0].tag, tagsCount[1].tag, tagsCount[2].tag];
  const results = { category: findedMaxCategory, tags: maxTreeTags };
  return results;
};
//랭킹보드
const getRanks = async () => {
  const LikesCount = [];
  const userList = await getUsers();
  for (let userId of userList) {
    //userId가 올린 모든 트랙의 트랙 아이디 찾기
    const findedTrackIds = await TrackIdsByUserId({ userId });
    if (findedTrackIds.length === 0) {
      LikesCount.push({ userId: userId, likeCnt: 0 });
    } else {
      const findedLikesCount = await Like.count({
        where: { trackId: { [Op.or]: findedTrackIds } },
      });
      LikesCount.push({ userId: userId, likeCnt: findedLikesCount });
    }
  }
  LikesCount.sort((a, b) => b.likeCnt - a.likeCnt);

  const LikesCountRank = LikesCount.map((el, i, arr) => {
    const parents = arr.length;
    const rank = i + 1;
    const rate = rank / parents;
    let classes = "";
    if (rate > 0 && rate <= 0.2) {
      classes = "탑스타 와오";
    } else if (rate <= 0.4) {
      classes = "핫한 와오";
    } else if (rate <= 0.6) {
      classes = "라이징스타 와오";
    } else if (rate <= 0.8) {
      classes = "끼쟁이 와오";
    } else {
      classes = "수줍은 와오";
    }
    return { rank: rank, class: classes, ...el };
  });
  //console.log(LikesCountRank);
  return LikesCountRank;
};
//user하나의 순위와 등급
const getRankByUserId = async ({ userId }) => {
  const findedRanks = await getRanks();
  const result = findedRanks
    .filter((el) => el.userId == userId)
    .map((el) => {
      let rankByUserId = {};
      rankByUserId["rank"] = el.rank;
      rankByUserId["class"] = el.class;
      return rankByUserId;
    });
  return result[0];
};
//최종 1인 통계
const getStatistics = async ({ userId }) => {
  const categoryTags = await getCategoryTags({ userId });
  const rankClass = await getRankByUserId({ userId });
  const result = { categoryTags, rankClass };
  return result;
};
module.exports = { getStatistics };
