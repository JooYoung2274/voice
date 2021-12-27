const { Track, Comment, Users, TrackTag } = require("../models");
const { Op } = require("sequelize");
const { and, or, like, not } = Op;

// const getTracksByKeywordTEST = async ({ keyword }) => {
//   try {
//     //   공백이 2개이상 존재하면 하나의 공백으로 변환
//     // keyword = keyword.replace(/\s\s+/gi, " ");

//     const questionSearchCondition = [{ title: { [like]: `%${keyword}%` } }];

//     // 방법1 유저의 닉네임으로 한번더 track을 find한다.
//     const results1 = await Users.findAll({
//       attributes: ["nickname"],
//       where: {
//         nickname: { [like]: `%${keyword}%` },
//       },
//     });

//     // 방법2 track을 통해서 한번에 찾는다.
//     const results = await Track.findAll({
//       attributes: ["trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
//       include: [
//         { model: TrackTag, attributes: ["tag"] },
//         { model: Users, attributes: ["nickname"] },
//       ],
//       where: {
//         [or]: [
//           {
//             title: { [like]: `%${keyword}%` },
//           },
//           {
//             //nickname자리
//           },
//         ],
//       },
//     });

//     return results;
//   } catch (error) {
//     throw error;
//   }
// };
// const getTracksByKeyword = async ({ keyword }) => {
//   try {
//     const results = await Comment.findAll({
//       attributes: ["commentId", "createdAt"],
//       include: [{ model: Users, attributes: ["nickname"] }],
//       where: {
//         comment: {
//           [Op.like]: "%" + keyword + "%",
//         },
//       },
//     });

//     return results;
//   } catch (error) {
//     throw error;
//   }
// };
const getTracksByKeyword = async ({ keyword }) => {
  try {
    const results = await Comment.findAll({
      attributes: ["commentId", "createdAt"],
      include: [{ model: Users, attributes: ["nickname"] }],
      where: {
        [or]: [
          {
            comment: { [like]: `%${keyword}%` },
          },
          {
            "$Users.nickname$": `%${keyword}%`,
          },
        ],
      },
    });

    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = { getTracksByKeyword };
