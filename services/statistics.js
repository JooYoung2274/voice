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
const TrackIdsByCategory = async (category, userId) => {
  const findedTrackIds = await Track.findAll({
    attributes: ["trackId"],
    where: category,
    userId,
  });
  const results = findedTrackIds.map((track) => track.trackId);
  return results;
};

//전체제외 카테고리 항목
const getCategorys = async () => {
  const categoryList = await Category.findAll({
    attributes: ["category"],
    where: { category: { [Op.ne]: "전체" } },
    order: [["category", "ASC"]],
  });
  const results = categoryList.map((el) => el.category);
  return results;
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
    return { category: null, tags: null };
  }
  //전체제외 카테고리 항목
  const categoryList = await getCategorys();

  //카테고리 항목 별로 userId가 올린 카테고리 세기
  for (let category of categoryList) {
    const findedCategoryCount = await Track.count({
      where: { userId, category },
    });
    //카테고리별 트랙 아이디 찾기
    const trackIdsByCategory = await TrackIdsByCategory({ category, userId });
    if (trackIdsByCategory.length === 0) {
      categorysCount.push({ category: category, count: findedCategoryCount, likeCnt: 0 });
    } else {
      //카테고리별 좋아요 세기
      const likeByCategoryCount = await Like.count({
        where: { trackId: { [Op.or]: trackIdsByCategory } },
      });
      categorysCount.push({
        category: category,
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
  const maxCategory = categorysCount[0].category;
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
  const results = { category: maxCategory, tags: maxTreeTags };
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
      LikesCount.push({ userId: userId, count: 0 });
    } else {
      const findedLikesCount = await Like.count({
        where: { trackId: { [Op.or]: findedTrackIds } },
      });
      LikesCount.push({ userId: userId, count: findedLikesCount });
    }
  }
  LikesCount.sort((a, b) => b.count - a.count);

  const LikesCountRank = LikesCount.map((el, i) => {
    return { rank: i + 1, ...el };
  });
  return LikesCountRank;
};
//user하나의 순위
const getRankByUserId = async ({ userId }) => {
  const findedRanks = await getRanks();
  const result = findedRanks.filter((el) => el.userId == userId).map((el) => el.rank);
  return result;
};
//최종 1인 통계
const getStatistics = async ({ userId }) => {
  const categoryTags = await getCategoryTags({ userId });
  const rank = await getRankByUserId({ userId });
  const result = { categoryTags, rank };
  return result;
};
module.exports = { getStatistics };
