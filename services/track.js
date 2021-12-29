const { Track, TrackTag, User, Like, Comment, Category, TrackThumbnail } = require("../models");
const sequelize = require("sequelize");
const { Op, fn, col } = require("sequelize");
const { customizedError } = require("../utils/error");

const createTrack = async ({ title, category, tag, trackThumbnailUrlFace, filename, userId }) => {
  if (!trackThumbnailUrlFace || !category || !tag || !title || !userId) {
    throw customizedError("녹음파일이 존재하지 않습니다.", 400);
  }

  const createdTrack = await Track.create({
    title: title,
    category: category,
    trackThumbnailUrlFace: trackThumbnailUrlFace,
    trackUrl: "http://54.180.82.210/" + filename,
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
  const result = createdTrack.trackId;

  return result;
};

const deleteTrackByTrackId = async ({ trackId }) => {
  const result = await Track.destroy({ where: { trackId: trackId } });

  if (!result) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }
  return;
};

const updateTrackByTrackId = async ({
  trackId,
  title,
  tag,
  category,
  trackThumbnailUrlFace,
  userId,
}) => {
  if (!trackThumbnailUrlFace || !category || !tag.length || !title || !trackId) {
    throw customizedError("권한이 없습니다.", 400);
  }

  const track = await Track.findOne({ where: { trackId: trackId } });
  if (track.userId !== userId) {
    throw customizedError("권한이 없습니다.", 400);
  }

  const result = await Track.update(
    { category: category, trackThumbnailUrl: trackThumbnailUrlFace, title: title },
    { where: { trackId: trackId } },
  );

  await TrackTag.destroy({ where: { trackId: trackId } });
  for (let i = 0; i < tag.length; i++) {
    await TrackTag.create({ tag: tag[i], trackId: trackId, category: category });
  }
  return result;
};

const getTracksByUserId = async ({ userId, myPage }) => {
  if (myPage) {
    const tracks = await Track.findAll({
      attributes: ["title", "trackId", "category", "trackUrl", "userId"],
      where: { userId: userId },
      include: [
        { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
        { model: TrackTag, attributes: ["tag"] },
        { model: User, attributes: ["nickname"] },
        {
          model: Like,
          attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
        },
        {
          model: Comment,
          attributes: [
            "commentId",
            "userId",
            "comment",
            [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
          ],
          include: [{ model: User, attributes: ["nickname"] }],
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
        attributes: ["title", "trackId", "category", "trackUrl", "userId"],
        include: [
          { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
          { model: TrackTag, attributes: ["tag"] },
          { model: User, attributes: ["nickname"] },
          {
            model: Like,
            attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
          },
          {
            model: Comment,
            attributes: [
              "commentId",
              "userId",
              "comment",
              [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
            ],
            include: [{ model: User, attributes: ["nickname"] }],
          },
        ],
        group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
        where: { trackId: likes[i].trackId },
      });
      likesArray.push(likesTracks);
    }

    return { tracks, likesArray };
  }

  const result = await Track.findAll({
    attributes: ["title", "trackId", "category", "trackUrl", "userId"],
    include: [
      { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Comment,
        attributes: [
          "commentId",
          "userId",
          "comment",
          [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
        ],
        include: [{ model: User, attributes: ["nickname"] }],
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

const getTrackByTrackId = async ({ trackId, userId }) => {
  const findedTrack = await Track.findOne({
    attributes: ["title", "trackId", "category", "trackUrl", "userId"],
    include: [
      { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Comment,
        attributes: [
          "commentId",
          "userId",
          "comment",
          [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
        ],
        include: [{ model: User, attributes: ["nickname"] }],
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
      attributes: ["title", "trackId", "category", "trackUrl", "userId"],

      where: { trackId: findedTrackIds[i] },
      include: [
        { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
        { model: TrackTag, attributes: ["tag"] },
        { model: User, attributes: ["nickname"] },
        {
          model: Like,
          attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
        },
        {
          model: Comment,
          attributes: [
            "commentId",
            "userId",
            "comment",
            [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
          ],
          include: [{ model: User, attributes: ["nickname"] }],
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
    attributes: ["title", "trackId", "category", "trackUrl", "userId"],
    order: [["category", "ASC"]],
    include: [
      { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Comment,
        attributes: [
          "commentId",
          "userId",
          "comment",
          [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
        ],
        include: [{ model: User, attributes: ["nickname"] }],
      },
    ],
    group: ["Track.trackId", "TrackTags.trackTagId", "Likes.likeId", "Comments.commentId"],
    where: { category: category },
  });
  if (!findedTracks) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }
  return findedTracks;
};

const getTracks = async () => {
  const totalTracks = await Track.findAll({
    attributes: ["title", "trackId", "category", "trackUrl", "userId"],
    include: [
      { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
      { model: TrackTag, attributes: ["tag"] },
      { model: User, attributes: ["nickname"] },
      {
        model: Like,
        attributes: [[sequelize.fn("COUNT", sequelize.col("Likes.trackId")), "likeCnt"]],
      },
      {
        model: Category,
        attributes: ["categoryText"],
      },
      {
        model: Comment,
        attributes: [
          "commentId",
          "userId",
          "comment",
          [sequelize.fn("COUNT", sequelize.col("Comments.trackId")), "commentCnt"],
        ],
        include: [{ model: User, attributes: ["nickname"] }],
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
    switch (totalTracks[i].Category.categoryText.split(" ")[1]) {
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
  const tracksTitle = { title: "최근에 올라온 목소리" };
  totalTracks.unshift(tracksTitle);
  return { categoryTracks, totalTracks };
};

module.exports = {
  createTrack,
  deleteTrackByTrackId,
  getTracksByUserId,
  getTrackByTrackId,
  getTracks,
  getTracksByLikes,
  getTracksByCategory,
  updateTrackByTrackId,
};
