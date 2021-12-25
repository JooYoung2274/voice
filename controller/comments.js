const commentService = require("../services/comments");

const commentPost = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    // comment validate만들기
    const { comment } = req.body;
    const { userId, nickname } = res.locals.user;
    // validate 만들어야할거같은데
    if (!comment || !trackId) {
      res.sendStatus(400);
      return;
    }
    const result = await commentService.createComment({
      comment,
      trackId,
      userId,
      nickname,
    });
    return res.status(200).json({ comment: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentPut = async (req, res, next) => {
  try {
    const { trackId, commentId } = req.params;
    //comment validate만들기
    const { comment } = req.body;
    const { userId, nickname } = res.locals.user;
    // middleware로 처리
    if (!comment || !trackId || !commentId) {
      res.sendStatus(400);
      return;
    }
    // updateComment에 들어가는 객체도 class화 해서 만들자
    const { createdAt, userId: commentUserId } = await commentService.findCommentByCommentId({
      commentId,
    });
    if (userId !== commentUserId) {
      res.sendStatus(400);
      return;
    }
    const result = await commentService.updateComment({
      commentId,
      comment,
      nickname,
      createdAt,
      trackId,
    });
    return res.status(200).json({ comment: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentDelete = async (req, res, next) => {
  try {
    const { trackId, commentId } = req.params;
    const { userId } = res.locals.user;
    const { userId: commentUserId } = await commentService.findCommentByCommentId({ commentId });

    // 비교로직 utils에 만들자 throw error
    if (userId !== commentUserId) {
      res.sendStatus(400);
      return;
    }
    await commentService.deleteComment({ trackId, commentId });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { commentPost, commentPut, commentDelete };
