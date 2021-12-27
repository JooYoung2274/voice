const { Like, Track, TrackTag, Category, Users, Tag } = require("../models");

const returnLikeCntAndLike = async ({ trackId, like }) => {
  const likeCnt = await Like.count({
    where: { trackId },
  });
  return { likeCnt, like };
};

const createOrDeleteLike = async ({ trackId, userId }) => {
  try {
    // 좋아요에서 일단 삭제
    const deleted = await Like.destroy({ where: { trackId, userId } });

    // 삭제가 안되면 생성
    if (!deleted) {
      // 트랙 존재유무 먼저 확인
      const findedTrack = await Track.findOne({ where: { trackId } });
      if (!findedTrack) {
        throw new Error("존재하지 않는 트랙입니다.");
      }

      // 좋아요 데이터 생성
      await Like.create({
        trackId,
        userId,
      });

      // 클라이언트에게 줄 데이터 가공
      const result = returnLikeCntAndLike({ trackId, like: true });
      return result;
    }

    // 클라이언트에게 줄 데이터 가공
    const result = returnLikeCntAndLike({ trackId, like: false });
    return result;
  } catch (error) {
    throw error;
  }
};

const findLikesByTrackId = async ({ trackId }) => {
  const findedLikes = await Like.count({ where: { trackId: trackId } });
  return findedLikes;
};

const findLike = async ({ findedTracks }) => {
  let array = [];
  for (let i = 0; i < findedTracks.length; i++) {
    const findedLikes = await Like.count({ where: { trackId: findedTracks[i] } });
    array.push(findedLikes);
  }
  return array;
};

const getTracks = async ({ userId }) => {
  const likes = await Like.findAll({
    attributes: ["trackId"],
    where: { userId: userId },
  });

  let array = [];
  for (let i = 0; i < likes.length; i++) {
    array.push(likes[i].trackId);
  }

  let tracks = [];
  for (let i = 0; i < array.length; i++) {
    const track = await Track.findOne({
      attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "userId"],
      where: { trackId: array[i] },
    });

    const { trackId, categoryId, thumbnailUrl, trackUrl, userId } = track;

    const findedCategory = await Category.findOne({
      attributes: ["category"],
      where: { categoryId: categoryId },
    });
    const category = findedCategory.category;

    const findedNickname = await Users.findOne({
      attributes: ["nickname"],
      where: { userId: userId },
    });
    const nickname = findedNickname.nickname;

    const findedTagid = await TrackTag.findOne({
      attributes: ["tagId"],
      where: { trackId: trackId, categoryId: categoryId },
    });
    const tagId = findedTagid.tagId;

    const findedTag = await Tag.findOne({
      attributes: ["tag"],
      where: { tagId: tagId },
    });
    const tag = findedTag.tag;

    const tracked = {
      trackId,
      category,
      tag,
      categoryId,
      thumbnailUrl,
      trackUrl,
      userId,
      nickname,
    };
    tracks.push(tracked);
  }
  console.log(tracks);
  return tracks;
};

module.exports = { createOrDeleteLike, findLikesByTrackId, findLike, getTracks };
