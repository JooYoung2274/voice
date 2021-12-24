const { Likes } = require("../models/index");
const likeClass = require("../classes/likes");
const { Track } = require("../models");
const { TrackTag } = require("../models/index");
const { Category } = require("../models/index");
const { Users } = require("../models");
const { Tag } = require("../models/index");

// const findLike = async ({ newTrackId, loginUserId }) => {
//   try {
//     const likeExist = await Likes.findOne({ where: { trackId: newTrackId, userId: loginUserId } });
//     return likeExist;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

const clickLike = async ({ newTrackId, loginUserId }) => {
  try {
    // newTrackId는 string, loginUserId는 int값임
    const likeExist = await Likes.findOne({ where: { trackId: newTrackId, userId: loginUserId } });
    if (!likeExist) {
      //   2개 선택하는거 맞나?
      await Likes.create({
        trackId: newTrackId,
        userId: loginUserId,
      });
      // likeCnt 중복됨
      const likeCnt = await Likes.count({
        where: { trackId: newTrackId },
      });
      const likeObj = new likeClass.likeForm({ likeCnt, like: true });
      return likeObj;
    }

    await Likes.destroy({ where: { trackId: newTrackId, userId: loginUserId } });
    // likeCnt 중복됨
    const likeCnt = await Likes.count({
      where: { trackId: newTrackId },
    });
    const likeObj = new likeClass.likeForm({ likeCnt, like: false });
    return likeObj;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const findLikes = async ({ newTrackId }) => {
  const findedLikes = await Likes.count({ where: { trackId: newTrackId } });
  return findedLikes;
};

const findLike = async ({ findedTracks }) => {
  let array = [];
  for (let i = 0; i < findedTracks.length; i++) {
    const findedLikes = await Likes.count({ where: { trackId: findedTracks[i] } });
    array.push(findedLikes);
  }
  return array;
};

const getTracks = async ({ userId }) => {
  const likes = await Likes.findAll({
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

module.exports = { clickLike, findLikes, findLike, getTracks };
