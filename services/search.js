const { Track, Users, TrackTag } = require("../models");
const { Op } = require("sequelize");
const { or, like } = Op;

//keyword로 track 가져오는 서비스함수
const getTracksByKeyword = async ({ keyword }) => {
  try {
    //   공백이 2개이상 존재하면 하나의 공백으로 변환(아직 더 생각해봐야함)
    // keyword = keyword.replace(/\s\s+/gi, " ");

    const trackSearchCondition = [
      { title: { [like]: `%${keyword}%` } },
      {
        "$User.nickname$": { [like]: `%${keyword}%` },
      },
    ];

    const results = await Track.findAll({
      where: {
        [or]: trackSearchCondition,
      },
      attributes: ["trackId", "category", "trackThumbnailUrl", "trackUrl", "userId"],
      include: [
        { model: TrackTag, attributes: ["tag"] },
        { model: Users, as: "User", attributes: ["nickname"] },
      ],
    });

    return results;
  } catch (error) {
    throw error;
  }
};

// //keyword로 comments가져오는 함수
// const getTracksByKeyword = async ({ keyword }) => {
//   try {
//     // keyword = keyword.replace(/\s\s+/gi, " ");

//     const results = await Comment.findAll({
//       where: {
//         [or]: [
//           {
//             comment: { [like]: `%${keyword}%` },
//           },
//           {
//             "$User.nickname$": { [like]: `%${keyword}%` },
//           },
//         ],
//       },
//       attributes: ["commentId", "createdAt"],
//       include: [{ model: Users, as: "User", attributes: ["nickname"] }],
//     });

//     return results;
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = { getTracksByKeyword };
