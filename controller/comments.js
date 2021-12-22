const commentService = require("../services/comments");

const commentPost = async (req, res, next) => {
  try {
    // const { trackId } = req.params;
    const { comment } = req.body;
    // const { userId } = res.locals.user;
    if (!comment) {
      res.sendStatus(400);
      return;
    }
    // const commentData = await commentService.createComment(trackId, comment, userId);
    const commentData = await commentService.createComment(comment);
    res.status(200).json({ comment: commentData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentPut = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    //comment validate만들기
    const { comment } = req.body;
    // const { userId } = res.locals.user;
    if (!comment) {
      res.sendStatus(400);
      return;
    }
    const commentData = await commentService.updateComment(comment, commentId);
    console.log(commentData);
    res.status(200).json({ comment: commentData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const commentDelete = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    // const { userId } = res.locals.user;
    // const comment = await commentService.findComment({ commentId });
    // 비교로직 utils에 만들자 throw error
    // if (comment.userId !== userId) {
    //   res.sendStatus(400);
    //   return;
    // } else {
    //   await commentService.deleteComment({ commentId });
    //   res.sendStatus(200);
    // }
    await commentService.deleteComment(commentId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { commentPost, commentPut, commentDelete };
