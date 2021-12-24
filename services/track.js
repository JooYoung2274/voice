const { Track } = require("../models/index");
const { TrackTag } = require("../models/index");
const { Category } = require("../models/index");
const { Users } = require("../models");
const { Likes } = require("../models/index");
const { Tag } = require("../models/index");

const Sequelize = require("sequelize");

const createTrack = async ({ categoryId, tagId, newThumbnailUrl, newTrackUrl, loginUserId }) => {
  const createdTrack = await Track.create({
    categoryId: categoryId,
    thumbnailUrl: newThumbnailUrl,
    trackUrl: newTrackUrl,
    userId: loginUserId,
  });

  for (let i = 0; i < tagId.length; i++) {
    if (tagId[i]) {
      await TrackTag.create({
        trackId: createdTrack.trackId,
        categoryId: categoryId,
        tagId: tagId[i],
      });
    }
  }

  return createdTrack.trackId;
};

const deleteTrack = async ({ newTrackId }) => {
  await Track.destroy({ where: { trackId: newTrackId } });
  return;
};

const getTracks = async ({ userId }) => {
  const tracks = await Track.findAll({
    attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "userId"],
    where: { userId: userId },
  });
  if (!tracks) {
    return;
  }

  let categoryArray = [];
  for (let i = 0; i < tracks.length; i++) {
    const { trackId, categoryId, thumbnailUrl, trackUrl } = tracks[i];

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

    const searchedCategory = { trackId, category, tag, thumbnailUrl, trackUrl, nickname };
    categoryArray.push(searchedCategory);
  }
  return categoryArray;
};

const getTrack = async ({ newTrackId, likes }) => {
  const findedTrack = await Track.findOne({
    attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "userId"],
    where: { trackId: newTrackId },
  });

  if (!findedTrack) {
    return;
  }
  const { trackId, categoryId, thumbnailUrl, trackUrl, userId } = findedTrack;

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

  const track = { trackId, category, tag, thumbnailUrl, trackUrl, nickname, userId, likes };
  return track;
};

const getPlainTrack = async ({ newTrackId }) => {
  try {
    const findedTrack = await Track.findOne({
      where: { trackId: newTrackId },
    });
    if (!findedTrack) {
      throw new Error("존재하지 않는 트랙입니다.");
    }
    const { dataValues: trackData } = findedTrack;
    return trackData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getSearchedTracks = async (findedTracks, likes) => {
  let tracks = [];
  for (let i = 0; i < findedTracks.length; i++) {
    const findedTrack = await Track.findOne({
      attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "userId"],
      where: { trackId: findedTracks[i] },
    });
    const { trackId, categoryId, thumbnailUrl, trackUrl, userId } = findedTrack;

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
    const like = likes[i];
    const track = { trackId, category, thumbnailUrl, trackUrl, nickname, tag, like };
    tracks.push(track);
  }
  return tracks;
};

const getMainTracks = async () => {
  let tracksArray = [];

  for (let i = 1; i < 9; i++) {
    const findedTracks = await Track.findAll({
      attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "userId"],
      where: { categoryId: i },
      order: [["categoryId", "DESC"]],
    });
    if (!findedTracks) {
      return;
    }
    let categoryArray = [];

    for (let j = 0; j < findedTracks.length; j++) {
      const { trackId, categoryId, thumbnailUrl, trackUrl, userId } = findedTracks[j];
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

      const track = { trackId, category, thumbnailUrl, trackUrl, nickname };
      categoryArray.push(track);
    }
    tracksArray.push(categoryArray);
  }
  return tracksArray;
};

const getLikeTrack = async () => {
  const tracks = await Track.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
        SELECT COUNT(*)
        FROM likes AS home
        WHERE
            home.trackId = track.trackId
      )`),
          "likeCnt",
        ],
      ],
    },
  });

  let array1 = [];
  let array2 = [];
  let array3 = [];
  let array4 = [];
  let array5 = [];
  let array6 = [];
  let array7 = [];
  let array8 = [];
  for (let i = 0; i < tracks.length; i++) {
    const { trackId, userId, trackUrl, thumbnailUrl, likeCnt } = tracks[i].dataValues;

    const findedCategoryId = await Track.findOne({
      attributes: ["categoryId"],
      where: { trackId: trackId },
    });
    const categoryId = findedCategoryId.categoryId;

    const findedCategory = await Category.findOne({
      attributes: ["category"],
      where: { categoryId: categoryId },
    });
    const category = findedCategory.category;

    const findedTagId = await TrackTag.findOne({
      attributes: ["tagId"],
      where: { trackId: trackId },
    });
    const tagId = findedTagId.tagId;

    const findedTag = await Tag.findOne({
      attributes: ["tag"],
      where: { tagId: tagId },
    });
    const tag = findedTag.tag;

    const data = { trackId, userId, trackUrl, thumbnailUrl, likeCnt, category, tag };

    if (data.category === "나레이션") {
      array1.push(data);
    }
    if (data.category === "라디오") {
      array2.push(data);
    }
    if (data.category === "오디오북") {
      array3.push(data);
    }
    if (data.category === "더빙") {
      array4.push(data);
    }
    if (data.category === "효과음") {
      array5.push(data);
    }
    if (data.category === "자동응답메세지") {
      array6.push(data);
    }
    if (data.category === "TV") {
      array7.push(data);
    }
    if (data.category === "성대모사") {
      array8.push(data);
    }
  }
  let array = [array1, array2, array3, array4, array5, array6, array7, array8];
  return array;
};

module.exports = {
  createTrack,
  deleteTrack,
  getTracks,
  getTrack,
  getPlainTrack,
  getMainTracks,
  getSearchedTracks,
  getLikeTrack,
};
