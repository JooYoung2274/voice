const {
  Track,
  TrackTag,
  User,
  Like,
  Tag,
  Comment,
  Category,
  TrackThumbnail,
  PlayList,
} = require("../models");
const { getTrackIdsByTag } = require("./tag");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { or, like } = Op;
const { customizedError } = require("../utils/error");
const { S3_HOST } = process.env;
const DIRECTORY = "tracks";

const createTrack = async ({ title, category, tag, trackThumbnailUrlFace, filename, userId }) => {
  if (!trackThumbnailUrlFace || !category || !tag.length || !title || !userId) {
    throw customizedError("잘못된 녹음 업로드 요청입니다.", 400);
  }

  if (title.length > 40) {
    throw customizedError("제목은 20자를 넘길 수 없습니다.", 400);
  }

  const createdTrack = await Track.create({
    title: title,
    category: category,
    trackThumbnailUrlFace: trackThumbnailUrlFace,
    trackUrl: `${S3_HOST}/${DIRECTORY}/${filename}`,
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
  if (!trackThumbnailUrlFace || !category || !tag.length || !trackId) {
    throw customizedError("잘못된 접근입니다.", 400);
  }

  if (title.length > 40) {
    throw customizedError("제목은 20자를 넘길 수 없습니다.", 400);
  }

  const track = await Track.findOne({ where: { trackId: trackId } });
  if (track.userId !== userId) {
    throw customizedError("권한이 없습니다.", 400);
  }

  await Track.update(
    { category: category, trackThumbnailUrlFace: trackThumbnailUrlFace, title: title },
    { where: { trackId: trackId } },
  );

  await TrackTag.destroy({ where: { trackId: trackId } });
  for (let i = 0; i < tag.length; i++) {
    if (tag[i] !== "") {
      await TrackTag.create({ tag: tag[i], trackId: trackId, category: category });
    }
  }
  return;
};

const getTracksByUserId = async ({ userId, myPage }) => {
  // userId에 해당하는 모든 트랙 불러오기
  let tracks = await Track.findAll({
    where: { userId: userId },
    ...trackBasicForm,
  });
  const results = await getTracksByOrdCreated({ tracks });

  // 해당 포트폴리오 User 정보 불러오기
  const userDate = await User.findOne({
    attributes: ["userId", "nickname", "profileImage", "contact", "introduce"],
    where: { userId: userId },
  });

  if (myPage) {
    const likes = await Like.findAll({
      attributes: ["trackId"],
      where: { userId: userId },
    });

    tracks = [];
    for (let i = 0; i < likes.length; i++) {
      const likesTracks = await Track.findOne({
        where: { trackId: likes[i].trackId },
        ...trackBasicForm,
      });
      tracks.push(likesTracks);
    }
    const likesArray = await getTracksByOrdCreated({ tracks });
    return { results, likesArray, userDate };
  }
  if (!tracks || !userDate) {
    throw customizedError("존재하지 않는 포트폴리오 페이지 입니다.", 400);
  }
  return { results, userDate };
};

const getTrackByTrackId = async ({ trackId }) => {
  const track = await Track.findOne({
    ...trackBasicForm,
    where: { trackId: trackId },
  });
  if (!track) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }
  const findedTrack = await insertLikeCnt(track);
  return findedTrack;
};

const getTracksByLikes = async ({ findedTrackIds }) => {
  let tracks = [];
  for (let i = 0; i < findedTrackIds.length; i++) {
    const findedTrack = await Track.findOne({
      attributes: ["title", "trackId", "category", "trackUrl", "userId", "createdAt"],

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
            "createdAt",
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

// 트랙이 기본적으로 가지는 property (성격이 다른 변수가 나타났으므로 아키텍처 수정필요)
const trackBasicForm = {
  attributes: ["title", "trackId", "category", "trackUrl", "userId", "createdAt"],
  include: [
    { model: TrackThumbnail, attributes: ["trackThumbnailUrlFace", "trackThumbnailUrlFull"] },
    { model: TrackTag, attributes: ["tag"] },
    { model: User, attributes: ["nickname"] },
    {
      model: Like,
      attributes: ["likeId"],
    },
    {
      model: Comment,
      attributes: ["commentId", "userId", "comment", "createdAt"],
      include: [{ model: User, attributes: ["nickname", "profileImage"] }],
    },
  ],
  order: [[Comment, "commentId", "DESC"]],
};

//track에 likeCnt 넣는 함수
const insertLikeCnt = (track) => {
  const { Likes: likesArray, Comments: commentsArray } = track.dataValues;
  track.dataValues.Likes = { likeCnt: likesArray.length };
  track.dataValues.CommentCnt = { commentCnt: commentsArray.length };
  return track;
};

//track에 최신순 sort하는 함수
const createdSort = (trackA, trackB) => {
  return trackB.dataValues.trackId - trackA.dataValues.trackId;
};

//track에 1.좋아요순 2.최신순 sort하는 함수
const likeCreatedSort = (trackA, trackB) => {
  if (trackB.dataValues.Likes.likeCnt === trackA.dataValues.Likes.likeCnt) {
    return createdSort(trackA, trackB);
  }
  return trackB.dataValues.Likes.likeCnt - trackA.dataValues.Likes.likeCnt;
};

//메인에 track자르는 개수:20
const TRACKNUM = 19;

// 메인에 처음에 주어지는 카테고리
const categoryFirst = { category: "전체", categoryText: "최근에 올라온 목소리" };

// 그냥 트랙들뽑기
const getTracks = async () => {
  const findedTracks = await Track.findAll(trackBasicForm);
  return findedTracks;
};

// 키워드별 여러 트랙뽑기
const getTracksByKeyword = async ({ keyword }) => {
  try {
    //   공백이 2개이상 존재하면 하나의 공백으로 변환(아직 더 생각해봐야함)
    // keyword = keyword.replace(/\s\s+/gi, " ");
    const results = await Track.findAll({
      where: {
        [or]: [
          { title: { [like]: `%${keyword}%` } },
          {
            "$User.nickname$": { [like]: `%${keyword}%` },
          },
        ],
      },
      ...trackBasicForm,
    });

    return results;
  } catch (error) {
    throw error;
  }
};

// 카테고리별 여러 트랙뽑기
const getTracksByCategory = async ({ category }) => {
  if (category === "전체") {
    const findedTracks = await Track.findAll({
      ...trackBasicForm,
    });
    if (!findedTracks) {
      throw customizedError("존재하지 않는 트랙입니다.", 400);
    }
    return findedTracks;
  }
  const findedTracks = await Track.findAll({
    where: { category },
    ...trackBasicForm,
  });
  if (!findedTracks) {
    throw customizedError("존재하지 않는 트랙입니다.", 400);
  }
  return findedTracks;
};
// 트랙들 넣으면 likeCnt 넣어주고 좋아요순으로 바뀌고 상위 20개 뽑음
const getTracksOrdLike = async ({ tracks }) => {
  tracks = tracks
    .map((track) => insertLikeCnt(track)) //likeCnt 넣어주기
    .sort((trackA, trackB) => likeCreatedSort(trackA, trackB)) //likeCnt 내림차순 likeCnt같다면 createdAt최신순
    .slice(0, TRACKNUM); //20개씩 자르기
  return tracks;
};

// 트랙들 넣으면 likeCnt 넣어주고 최신순으로 바뀌고 개수 제한 없음
const getTracksByOrdCreated = async ({ tracks }) => {
  tracks = tracks
    .map((track) => insertLikeCnt(track)) //likeCnt 넣어주기
    .sort((trackA, trackB) => createdSort(trackA, trackB)); // trackId 최신순
  return tracks;
};

// 트랙들 넣으면 likeCnt 넣어주고 최신순으로 바뀌고 상위 20개 뽑음
const getTracksByOrdCreatedLimit = async ({ tracks }) => {
  tracks = tracks
    .map((track) => insertLikeCnt(track)) //likeCnt 넣어주기
    .sort((trackA, trackB) => createdSort(trackA, trackB)) // trackId 최신순
    .slice(0, TRACKNUM);
  return tracks;
};

// main에 카테고리와 text를 객체로 따로 주기위한 service
const getCategory = async ({ category }) => {
  const categoryAndText = await Category.findOne({
    attributes: ["category", "categoryText"],
    where: { category },
  });
  return categoryAndText;
};

// trackId로 하나의 트랙 뽑기  (getTrackByTrackId에서 userId분리하면 지워도 되는 service)
const getTrackByTrackId2 = async ({ trackId }) => {
  const findedTrack = await Track.findOne({
    where: { trackId },
    ...trackBasicForm,
  });
  return findedTrack;
};

// trackTag들 안에 있는 trackId로 여러 트랙 뽑기
const getTracksByTrackTags = async ({ trackIds }) => {
  const results = [];
  for (let i = 0; i < trackIds.length; i++) {
    const track = await getTrackByTrackId2({ trackId: trackIds[i] });
    results.push(track);
  }
  return results;
};

// keyword로 찾은 트랙 최종 service
const getTracksForSearch = async ({ keyword }) => {
  // keyword로 track들 찾기
  const tracksInKeyword = await getTracksByKeyword({ keyword });
  // 찾은 track들 likCnt넣고 최신순으로 정렬
  const results = await getTracksByOrdCreated({ tracks: tracksInKeyword });
  return results;
};

// tag와 카테고리로 찾은 트랙 최종 service
const getTracksForCategory = async ({ tags, category }) => {
  try {
    const findedCategory = await Category.findOne({ where: { category } });
    if (!findedCategory) {
      throw customizedError("운영하고 있는 카테고리가 아닙니다.", 400);
    }
    // 파라미터에서 항상 tag1=tag2=tag3=형식으로 온다고 가정
    if (tags.length !== 3) {
      throw customizedError("올바른 태그 요청이 아닙니다.", 400);
    }

    // 카테고리만 올경우
    if (tags[0] === "" && tags[1] === "" && tags[2] === "") {
      const tracksInCtry = await getTracksByCategory({ category });
      const results = await getTracksByOrdCreated({ tracks: tracksInCtry });
      const results2 = { categoryTags: tags, tracks: results };
      return results2;
    }

    // 실제 db에 있는 태그만 필터링
    const findedTags = [];
    for (const tag of tags) {
      const findedTag = await Tag.findOne({ where: { tag } });
      if (findedTag) {
        findedTags.push(tag);
      }
    }

    // 카테고리와 태그가 올경우

    // 카테고리와 필터링된 태그로 tracktag들 찾기
    const findedTrackIds = await getTrackIdsByTag({ tag: findedTags, category });
    // if (!findedTrackTags) {
    //   // db에 태그에 맞는 track이 없을경우 트랙을 주지 않음
    //   return;
    // }
    // 찾은 tracktag들로 track들 찾기
    const tracksByTrackIds = await getTracksByTrackTags({ trackIds: findedTrackIds });
    // track들 likCnt넣고 최신순으로 정렬

    const results = await getTracksByOrdCreated({ tracks: tracksByTrackIds });
    const results2 = { categoryTags: tags, tracks: results };
    return results2;
  } catch (error) {
    throw error;
  }
};

// main 데이터 주는 최종 service
const getTracksForMain = async () => {
  try {
    const results = [];
    // 트랙들 뽑기
    const plainTracks = await getTracks();
    // 트랙들 likCnt넣고 최신순으로 몇개만 가져오기
    const tracksOrdCreated = await getTracksByOrdCreatedLimit({ tracks: plainTracks });
    // 리턴되는 배열에 먼저 최신순으로 가져온 전체데이터 넣기
    results.push({ category: categoryFirst, tracks: tracksOrdCreated });

    // category 이름순으로 정렬
    const categoriesList = await Category.findAll({
      order: [["category", "ASC"]],
    });

    // category를 기준으로 track들 가져온 후 results배열에 push
    for (const category of categoriesList) {
      const tracksInCtry = await getTracksByCategory({
        category: category.dataValues.category,
      });
      // category에 없으면 넣지 않음
      if (tracksInCtry.length === 0) {
        continue;
      }
      // 카테고리 text뽑기
      const categoryAndText = await getCategory({ category: category.dataValues.category });
      // 좋아요 순뽑고 likeCnt 바꿔주면서 20개씩 자르기
      const tracksInCtryOrdLike = await getTracksOrdLike({ tracks: tracksInCtry });
      // 프론트에게 주기위해 배열안에 담음
      results.push({ category: categoryAndText, tracks: tracksInCtryOrdLike });
    }
    return results;
  } catch (error) {
    throw error;
  }
};

const updateListByTrackId = async ({ trackId, userId }) => {
  try {
    if (!trackId.length) {
      throw customizedError("선택된 트랙이 없습니다.", 400);
    }
    await PlayList.destroy({ where: { userId: userId } });
    for (let i = 0; i < trackId.length; i++) {
      await PlayList.create({ trackId: trackId[i], userId: userId });
    }
  } catch (error) {
    throw error;
  }
};

const getListByUserId = async ({ userId }) => {
  try {
    const trackIds = [];
    const trackId = await PlayList.findAll({ where: { userId: userId } });
    for (let i = 0; i < trackId.length; i++) {
      trackIds.push(trackId[i].trackId);
    }
    const tracks = [];
    for (let i = 0; i < trackIds.length; i++) {
      const track = await Track.findOne(trackBasicForm, { where: { trackId: trackIds[i] } });
      tracks.push({
        name: track.title,
        singer: track.User.nickname,
        cover: track.TrackThumbnail.trackThumbnailUrlFace,
        musicSrc: track.trackUrl,
      });
    }
    return { tracks };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createTrack,
  deleteTrackByTrackId,
  getTracksByUserId,
  getTrackByTrackId,
  getTracksForSearch,
  getTracksForCategory,
  getTracksForMain,
  getTracksByLikes,
  getTracksByCategory,
  updateTrackByTrackId,
  updateListByTrackId,
  getListByUserId,
  getTracksByKeyword,
};
