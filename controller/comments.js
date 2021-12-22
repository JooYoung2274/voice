const commentService = require("../services/comments");

const commentPost = (req, res, next) => {
  try {
    const { newTrackId } = req.params;
    // comment validate만들기
    const { comment: newComment } = req.body;
    const { userId: loginUserId, nickname: loginNickname } = res.locals.user;
    if (!newComment) {
      res.sendStatus(400);
      return;
    }
    const processedComment = commentService.createComment({
      newComment,
      newTrackId,
      loginUserId,
      loginNickname,
    });
    return res.status(200).json({ comment: processedComment });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentPut = (req, res, next) => {
  try {
    const { commentId: newCommentId } = req.params;
    //comment validate만들기
    const { comment: newComment } = req.body;
    const { userId: loginUserId, nickname: loginNickname } = res.locals.user;
    // middleware로 처리
    if (!newComment) {
      res.sendStatus(400);
      return;
    }
    // updateComment에 들어가는 객체도 class화 해서 만들자
    const {
      comment,
      commentId,
      createdAt,
      userId: commentUserId,
    } = commentService.findComment({ newCommentId });
    if (loginUserId !== commentUserId) {
      res.sendStatus(400);
      return;
    }
    const processedComment = commentService.updateComment({
      newComment,
      newCommentId,
      loginUserId,
      loginNickname,
      comment,
      commentId,
      createdAt,
    });
    return res.status(200).json({ comment: processedComment });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentDelete = (req, res, next) => {
  try {
    const { commentId: newCommentId } = req.params;
    const { userId: loginUserId } = res.locals.user;
    const { userId: commentUserId } = commentService.findComment({ newCommentId });
    // 비교로직 utils에 만들자 throw error
    if (loginUserId !== commentUserId) {
      res.sendStatus(400);
      return;
    }
    commentService.deleteComment({ newCommentId });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { commentPost, commentPut, commentDelete };
