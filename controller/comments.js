const commentService = require("../services/comments");

const commentPost = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    // comment validate만들기
    const { comment: newComment } = req.body;
    const { userId: loginUserId, nickname: loginNickname } = res.locals.user;
    if (!newComment || !newTrackId) {
      res.sendStatus(400);
      return;
    }
    const processedComment = await commentService.createComment({
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

const commentPut = async (req, res, next) => {
  try {
    const { trackId: newTrackId, commentId: newCommentId } = req.params;
    //comment validate만들기
    const { comment: newComment } = req.body;
    const { userId: loginUserId, nickname: loginNickname } = res.locals.user;
    // middleware로 처리
    if (!newComment || !newTrackId || !newCommentId) {
      res.sendStatus(400);
      return;
    }
    // updateComment에 들어가는 객체도 class화 해서 만들자
    const { createdAt, userId: commentUserId } = await commentService.findComment({ newCommentId });
    if (loginUserId !== commentUserId) {
      res.sendStatus(400);
      return;
    }
    const processedComment = await commentService.updateComment({
      newCommentId,
      newComment,
      loginNickname,
      createdAt,
      newTrackId,
    });
    return res.status(200).json({ comment: processedComment });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentDelete = async (req, res, next) => {
  try {
    const { trackId: newTrackId, commentId: newCommentId } = req.params;
    const { userId: loginUserId } = res.locals.user;
    const { userId: commentUserId } = await commentService.findComment({ newCommentId });

    // 비교로직 utils에 만들자 throw error
    if (loginUserId !== commentUserId) {
      res.sendStatus(400);
      return;
    }
    await commentService.deleteComment({ newTrackId, newCommentId });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { commentPost, commentPut, commentDelete };
