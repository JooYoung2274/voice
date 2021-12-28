const { Track, TrackTag, Tag, Category, User, Like, Comment } = require("../models");
const sequelize = require("sequelize");
const { Op, fn, col } = require("sequelize");
const customizedError = require("../utils/error");

const createTrack = async ({ title, category, tag, trackThumbnailUrl, filename, userId }) => {
  if (!trackThumbnailUrl || !category || !tag || !title || !userId || !filename) {
    throw customizedError("녹음파일이 존재하지 않습니다.", 400);
  }
  const createdTrack = await Track.create({
    title: title,
    category: category,
    trackThumbnailUrl: trackThumbnailUrl,
    trackUrl: filename,
    userId: userId,
  });
  for (let i = 0; i < tag.length; i++) {
    if (tag[i]) {
      await TrackTag.create({
        trackId: createdTrack.trackId,
        tag: tag[i],
        category: category,
      });
    }
  }
  return;
};

const deleteTrackByTrackId = async ({ trackId }) => {
  const result = await Track.destroy({ where: { trackId: trackId } });

  if (!result) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }
  return;
};

const updateTrackByTrackId = async ({ trackId, title, tag, category, trackThumbnailUrl }) => {
  if (!trackThumbnailUrl || !category || !tag.length || !title || !trackId) {
    throw customizedError("권한이 없습니다.", 400);
  }
  const updateTrack = await Track.update(
    { category: category, trackThumbnailUrl: trackThumbnailUrl },
    { where: { trackId: trackId } },
  );
  return updateTrack;
};

const getTracksByUserId = async ({ userId, myPage }) => {
  if (myPage) {
    const tracks = await Track.findAll({
      attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
      where: { userId: userId },
      include: [
        { model: TrackTag, attributes: ["tag"] },
        { model: User, attributes: ["nickname"] },
        {
          model: Like,
          attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
        },
        {
          model: Comment,
          attributes: [[sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"]],
        },
      ],
      group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
    });

    // sequelize subquery 로 해야할듯
    const likes = await Like.findAll({
      attributes: ["trackId"],
      where: { userId: userId },
    });

    if (!tracks || !likes) {
      throw customizedError("존재하지 않는 트랙입니다.", 400);
    }

    let likesArray = [];
    for (let i = 0; i < likes.length; i++) {
      const likesTracks = await Track.findAll({
        attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
        include: [
          { model: TrackTag, attributes: ["tag"] },
          { model: User, attributes: ["nickname"] },
        ],
        where: { trackId: likes[i].trackId },
      });
      likesArray.push(likesTracks);
    }

    return { tracks, likesArray };
  }

  const result = await Track.findAll({
    attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
    include: [
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Comment,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"]],
      },
    ],
    group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
    where: { userId: userId },
  });

  if (!result) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }

  return result;
};

const getTrackByTrackId = async ({ trackId, userId, likes }) => {
  const findedTrack = await Track.findOne({
    attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
    include: [
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Comment,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"]],
      },
    ],
    group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
    where: { trackId: trackId },
  });

  if (!findedTrack) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }

  if (userId !== findedTrack.userId) {
    throw customizedError("권한이 없습니다.", 400);
  }

  return findedTrack;
};

const getTracksByLikes = async ({ findedTrackIds }) => {
  let tracks = [];
  for (let i = 0; i < findedTrackIds.length; i++) {
    const findedTrack = await Track.findOne({
      attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],

      where: { trackId: findedTrackIds[i] },
      include: [
        { model: TrackTag, attributes: ["tag"] },
        { model: User, attributes: ["nickname"] },
        {
          model: Like,
          attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
        },
        {
          model: Comment,
          attributes: [[sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"]],
        },
      ],
      group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
    });
    tracks.push(findedTrack);
  }

  if (!tracks.length) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }

  return tracks;
};

const getTracksByCategory = async ({ category }) => {
  const findedTracks = await Track.findAll({
    attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
    order: [["category", "ASC"]],
    include: [
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
    ],
    where: { category: category },
  });
  if (!findedTracks) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }
  return findedTracks;
};
const getTracks = async () => {
  const totalTracks = await Track.findAll({
    attributes: ["title", "trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
    include: [
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Comment,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"]],
      },
    ],
    order: [["createdAt", "DESC"]],
    group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
  });

  if (!totalTracks) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }

  let categoryTracks = [[], [], [], [], [], [], [], [], []];
  for (let i = 0; i < totalTracks.length; i++) {
    switch (totalTracks[i].category) {
      case "자유 주제":
        categoryTracks[0].push(totalTracks[i]);
        break;
      case "ASMR":
        categoryTracks[1].push(totalTracks[i]);
        break;
      case "힐링/응원":
        categoryTracks[2].push(totalTracks[i]);
        break;
      case "노래":
        categoryTracks[3].push(totalTracks[i]);
        break;
      case "외국어":
        categoryTracks[4].push(totalTracks[i]);
        break;
      case "나레이션":
        categoryTracks[5].push(totalTracks[i]);
        break;
      case "성대모사":
        categoryTracks[6].push(totalTracks[i]);
        break;
      case "유행어":
        categoryTracks[7].push(totalTracks[i]);
        break;
      case "효과음":
        categoryTracks[8].push(totalTracks[i]);
        break;
      default:
        break;
    }
  }
  return { categoryTracks, totalTracks };
};
const getLikeTrack = async () => {
  const tracks = await Track.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
        SELECT COUNT(*)
        FROM like AS home
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
  deleteTrackByTrackId,
  getTracksByUserId,
  getTrackByTrackId,
  getTracks,
  getTracksByLikes,
  getLikeTrack,
  getTracksByCategory,
  updateTrackByTrackId,
};
