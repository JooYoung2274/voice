const commentService = require("../services/comment");

// 댓글 post 메소드
const commentPost = async (req, res, next) => {
  try {
    // params와 body에서값 받기 & body에서 오는 comment는 validate필요
    const { trackId } = req.params;
    const { comment } = req.body;

    // auth 미들웨어에서 오는 user정보 받기
    const { userId } = res.locals.user;

    // 댓글만드는 service 실행
    const results = await commentService.createComment({
      comment,
      trackId,
      userId,
    });
    return res.status(200).json({ trackId: trackId, comments: results });
  } catch (error) {
    next(error);
  }
};

// // 댓글 put 메소드
// const commentPut = async (req, res, next) => {
//   try {
//     // params와 body에서값 받기 & body에서 오는 comment는 validate필요
//     const { trackId, commentId } = req.params;
//     const { comment } = req.body;

//     // auth 미들웨어에서 오는 user정보 받기
//     const { userId, nickname } = res.locals.user;

//     // 댓글 수정하는 service 실행
//     const results = await commentService.updateComment({
//       commentId,
//       comment,
//       userId,
//       nickname,
//       trackId,
//     });
//     return res.status(200).json({ comment: results });
//   } catch (error) {
//     next(error);
//   }
// };

// 댓글 delete메소드
const commentDelete = async (req, res, next) => {
  try {
    // params에서값 받기
    const { trackId, commentId } = req.params;

    // auth 미들웨어에서 오는 user정보 받기
    const { userId } = res.locals.user;

    // 댓글 삭제하는 service 실행
    const results = await commentService.deleteComment({ userId, trackId, commentId });
    return res.status(200).json({ comments: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { commentPost, commentDelete };
