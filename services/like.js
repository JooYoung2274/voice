const { Like, Track } = require("../models");
const { customizedError } = require("../utils/error");

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
        throw customizedError("존재하지 않는 트랙입니다.", 400);
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

// const findLikesByTrackId = async ({ trackId }) => {
//   const findedLikes = await Like.count({ where: { trackId: trackId } });
//   return findedLikes;
// };

// const findLike = async ({ findedTracks }) => {
//   let array = [];
//   for (let i = 0; i < findedTracks.length; i++) {
//     const findedLikes = await Like.count({ where: { trackId: findedTracks[i] } });
//     array.push(findedLikes);
//   }
//   return array;
// };

module.exports = { createOrDeleteLike };
