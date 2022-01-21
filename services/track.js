const {
  Track,
  TrackTag,
  User,
  Like,
  Comment,
  Category,
  TrackThumbnail,
  PlayList,
} = require("../models");
const { getTrackIdsByTagAndCtryId, filteringTags } = require("./tag");
const { getCtryByCtry } = require("./category");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const { or, like, ne } = Op;
const { customizedError } = require("../utils/error");
const CATEGORYALLID = 1;
const CATEGORYALL = "전체";
const CATEGORYALLTEXT = "최근에 올라온 목소리";
const TRACKNUM = 19;
const { S3_HOST } = process.env;
const TRACKS = "tracks";

const { randomFilename } = require("../middleware/uploader");

const { convertAndSaveS3 } = require("../utils/converter");

const createTrack = async ({ title, category, tags, trackThumbnailId, location, userId }) => {
  if (!trackThumbnailId || !userId) {
    throw customizedError("잘못된 녹음 업로드 요청입니다.", 400);
  }

  const findedTags = await filteringTags(tags);
  if (findedTags.length === 0) {
    throw customizedError("적어도 하나의 태그는 선택해야 합니다.", 400);
  }

  const findedCategory = await getCtryByCtry({ category });
  if (!findedCategory) {
    throw customizedError("현재 운영하고 있는 카테고리가 아닙니다.", 400);
  }
  const { categoryId } = findedCategory;

  if (!title || title.length > 40) {
    throw customizedError("제목은 존재해야하고 20자를 넘길 수 없습니다.", 400);
  }
  // const ranFileName = `${randomFilename()}.mp3`;
  // convertAndSaveS3(ranFileName, location);
  // const newLocation = `${S3_HOST}/${TRACKS}/${ranFileName}`;

  const createdTrack = await Track.create({
    title,
    categoryId,
    trackThumbnailId,
    trackUrl: location,
    userId,
  });
  const trackId = createdTrack.trackId;
  for (let i = 0; i < tags.length; i++) {
    if (tags[i]) {
      await TrackTag.create({
        trackId,
        tag: tags[i],
        categoryId,
      });
    }
  }
  const result = trackId;

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
  tags,
  category,
  trackThumbnailId,
  userId,
}) => {
  if (!trackThumbnailId || !trackId) {
    throw customizedError("잘못된 접근입니다.", 400);
  }

  const findedTags = await filteringTags(tags);
  if (findedTags.length === 0) {
    throw customizedError("적어도 하나의 태그는 선택해야 합니다.", 400);
  }

  // category값 아예안올때도 확인
  const findedCategory = await getCtryByCtry({ category });
  if (!findedCategory) {
    throw customizedError("현재 운영하고 있는 카테고리가 아닙니다.", 400);
  }
  const { categoryId } = findedCategory;
  if (!title || title.length > 40) {
    throw customizedError("제목은 존재해야하고 20자를 넘길 수 없습니다.", 400);
  }

  const track = await Track.findOne({ where: { trackId } });
  if (track.userId !== userId) {
    throw customizedError("권한이 없습니다.", 400);
  }

  await Track.update({ categoryId, trackThumbnailId, title }, { where: { trackId } });

  await TrackTag.destroy({ where: { trackId } });
  for (let i = 0; i < tags.length; i++) {
    if (tags[i] !== "") {
      await TrackTag.create({ tag: tags[i], trackId, categoryId });
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
  const findedTrack = await insertLikeAndCmtCnt(track);
  return findedTrack;
};

// 트랙이 기본적으로 가지는 property (성격이 다른 변수가 나타났으므로 아키텍처 수정필요)
const trackBasicForm = {
  attributes: ["title", "trackId", "trackUrl", "userId", "createdAt"],
  include: [
    {
      model: TrackThumbnail,
      attributes: ["trackThumbnailId", "trackThumbnailUrlFace", "trackThumbnailUrlFull"],
    },
    { model: TrackTag, attributes: ["tag"] },
    { model: User, attributes: ["nickname", "profileImage"] },
    {
      model: Like,
      attributes: ["likeId"],
    },
    { model: Category, attributes: ["category"] },
    {
      model: Comment,
      attributes: ["commentId", "userId", "comment", "createdAt"],
      include: [{ model: User, attributes: ["nickname", "profileImage"] }],
    },
  ],
  order: [[Comment, "commentId", "DESC"]],
};

//track에 likeCnt, commentCnt 넣는 함수
const insertLikeAndCmtCnt = (track) => {
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

// 메인에 처음에 주어지는 카테고리
const categoryFirst = { category: CATEGORYALL, categoryText: CATEGORYALLTEXT };

// 그냥 트랙들뽑기
const getTracks = async () => {
  const findedTracks = await Track.findAll(trackBasicForm);
  return findedTracks;
};

// 키워드별 여러 트랙뽑기
const getTracksByKeyword = async ({ keyword }) => {
  try {
    // 띄어쓰기 된 키워드가 2개일때만 구현해 놓음.
    // 만약 띄어쓰기 된 키워드가 3개 이상일 경우 검색 코드 전체적으로 좀 달라져야함.
    // 추후에 협의 후 수정해야 할 듯.
    const keywordArray = keyword.split(" ");

    if (keywordArray.length !== 1) {
      const results = await Track.findAll({
        where: {
          [or]: [
            { title: { [like]: `%${keywordArray[0].trim()}%` } },
            { title: { [like]: `%${keywordArray[1].trim()}%` } },
            {
              "$User.nickname$": { [like]: `%${keywordArray[0].trim()}%` },
            },
            {
              "$User.nickname$": { [like]: `%${keywordArray[1].trim()}%` },
            },
          ],
        },
        ...trackBasicForm,
      });

      return results;
    }
    // 띄어쓰기 없는 키워드로 검색했을 때
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
const getTracksByCtryId = async ({ categoryId }) => {
  if (categoryId === CATEGORYALLID) {
    const findedTracks = await getTracks();
    return findedTracks;
  }
  const findedTracks = await Track.findAll({
    where: { categoryId },
    ...trackBasicForm,
  });
  return findedTracks;
};
// 트랙들 넣으면 likeCnt 넣어주고 좋아요순으로 바뀌고 상위 20개 뽑음
const getTracksOrdLike = async ({ tracks }) => {
  tracks = tracks
    .map((track) => insertLikeAndCmtCnt(track)) //likeCnt 넣어주기
    .sort((trackA, trackB) => likeCreatedSort(trackA, trackB)) //likeCnt 내림차순 likeCnt같다면 createdAt최신순
    .slice(0, TRACKNUM); //20개씩 자르기
  return tracks;
};

// 트랙들 넣으면 likeCnt 넣어주고 최신순으로 바뀌고 개수 제한 없음
const getTracksByOrdCreated = async ({ tracks }) => {
  tracks = tracks
    .map((track) => insertLikeAndCmtCnt(track)) //likeCnt 넣어주기
    .sort((trackA, trackB) => createdSort(trackA, trackB)); // trackId 최신순
  return tracks;
};

// 트랙들 넣으면 likeCnt 넣어주고 최신순으로 바뀌고 상위 20개 뽑음
const getTracksByOrdCreatedLimit = async ({ tracks }) => {
  tracks = tracks
    .map((track) => insertLikeAndCmtCnt(track)) //likeCnt 넣어주기
    .sort((trackA, trackB) => createdSort(trackA, trackB)) // trackId 최신순
    .slice(0, TRACKNUM);
  return tracks;
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
const getTracksByTrackIds = async ({ trackIds }) => {
  const results = [];
  for (let i = 0; i < trackIds.length; i++) {
    const track = await getTrackByTrackId2({ trackId: trackIds[i] });
    results.push(track);
  }
  return results;
};
///////////////////////////////////////////////////////////////
// const accSort = (trackA, trackB) => {
//   return trackB.dataValues.trackId - trackA.dataValues.trackId;
// };

// const getTracksByOrdAcc = async ({ tracks }) => {
//   tracks = tracks
//     .map((track) => insertLikeCnt(track)) //likeCnt 넣어주기
//     .sort((trackA, trackB) => accSort(trackA, trackB));
//   return tracks;
// };
///////////////////////////////////////////////////////////////
// keyword로 찾은 트랙 최종 service
const getTracksForSearch = async ({ keyword, page, track }) => {
  // keyword로 track들 찾기
  // test === true면 정확도순 정렬
  let start = 0;
  const pageSize = track;
  if (page <= 0 || !page) {
    page = 1;
  } else {
    start = (page - 1) * pageSize;
  }
  let end = page * pageSize;
  const tracksInKeyword = await getTracksByKeyword({ keyword });
  const results = await getTracksByOrdCreated({ tracks: tracksInKeyword });
  const pagingResults = results.slice(start, end);
  return pagingResults;
};

// tag와 카테고리로 찾은 트랙 최종 service
const getTracksForCategory = async ({ tags, category, page, track }) => {
  try {
    let start = 0;
    let pageSize = track;
    if (page <= 0 || !page) {
      page = 1;
    } else {
      start = (page - 1) * pageSize;
    }
    let end = page * pageSize;
    const findedCategory = await getCtryByCtry({ category });
    if (!findedCategory) {
      throw customizedError("운영하고 있는 카테고리가 아닙니다.", 400);
    }
    const { categoryId } = findedCategory;
    // 파라미터에서 항상 tag1=tag2=tag3=형식으로 온다고 가정
    if (tags.length !== 3) {
      throw customizedError("올바른 태그 요청이 아닙니다.", 400);
    }

    // 카테고리만 올경우
    if (tags[0] === "" && tags[1] === "" && tags[2] === "") {
      const tracksInCtry = await getTracksByCtryId({ categoryId });
      const results = await getTracksByOrdCreated({ tracks: tracksInCtry });
      const pagingResults = results.slice(start, end);
      const results2 = { categoryTags: tags, tracks: pagingResults };
      return results2;
    }

    // 실제 db에 있는 태그만 필터링
    const findedTags = await filteringTags(tags);

    // 카테고리와 태그가 올경우

    // 카테고리와 필터링된 태그로 tracktag들 찾기
    const findedTrackIds = await getTrackIdsByTagAndCtryId({ tag: findedTags, categoryId });
    // 찾은 tracktag들로 track들 찾기
    const tracksByTrackIds = await getTracksByTrackIds({ trackIds: findedTrackIds });
    // track들 likCnt넣고 최신순으로 정렬

    const results = await getTracksByOrdCreated({ tracks: tracksByTrackIds });
    const pagingResults = results.slice(start, end);
    const results2 = { categoryTags: tags, tracks: pagingResults };
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
      where: {
        category: {
          [ne]: CATEGORYALL,
        },
      },
    });

    // category를 기준으로 track들 가져온 후 results배열에 push
    for (const category of categoriesList) {
      const tracksInCtry = await getTracksByCtryId({
        categoryId: category.dataValues.categoryId,
      });
      // category에 없으면 넣지 않음
      if (tracksInCtry.length === 0) {
        continue;
      }
      // 카테고리 text뽑기
      const categoryAndText = {
        category: category.dataValues.category,
        categoryText: category.dataValues.categoryText,
      };
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
    const playlist = [];
    const tracks = [];
    for (let i = 0; i < trackIds.length; i++) {
      const track = await Track.findOne({ where: { trackId: trackIds[i] }, ...trackBasicForm });
      tracks.push(track);
    }
    for (let i = 0; i < tracks.length; i++) {
      playlist.push({
        name: tracks[i].title,
        singer: tracks[i].User.nickname,
        cover: {
          trackThumbnailId: tracks[i].TrackThumbnail.trackThumbnailId,
          trackThumbnailUrlFace: tracks[i].TrackThumbnail.trackThumbnailUrlFace,
          trackThumbnailUrlFull: tracks[i].TrackThumbnail.trackThumbnailUrlFull,
        },
        musicSrc: tracks[i].trackUrl,
        trackId: tracks[i].trackId,
      });
    }
    return { playlist };
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
  getTracksByCtryId,
  updateTrackByTrackId,
  updateListByTrackId,
  getListByUserId,
  getTracksByKeyword,
};
