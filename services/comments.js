const { Comments } = require("../models/index");
const CommentClass = require("../classes/comments");

const findComments = ({ trackId }) => {
  return Comments.findAll({ where: { trackId } });
};

const findComment = async ({ newCommentId }) => {
  try {
    const comment = await Comments.findOne({ where: { commentId: newCommentId } });
    return comment;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createComment = async ({ newComment, newTrackId, loginUserId, loginNickname }) => {
  try {
    const { comment, commentId, createdAt } = await Comments.create({
      comment: newComment,
      trackId: newTrackId,
      userId: loginUserId,
    });
    const commentObj = new CommentClass.CommentForm({
      commentId: commentId,
      nickname: loginNickname,
      comment: comment,
      createdAt: createdAt,
    });
    return commentObj;
  } catch (error) {
    console.log(error);
    // throw Error(error)?

    return error;
  }
};

const updateComment = async ({
  newComment,
  newCommentId,
  loginNickname,
  comment,
  commentId,
  createdAt,
}) => {
  try {
    await Comments.update({ comment: newComment }, { where: { commentId: newCommentId } });
    const commentObj = new CommentClass.CommentForm({
      commentId: commentId,
      nickname: loginNickname,
      comment: comment,
      createdAt: createdAt,
    });
    return commentObj;
  } catch (error) {
    console.log(error);
    // throw Error(error)?
    return error;
  }
};

const deleteComment = async ({ newCommentId }) => {
  try {
    await Comments.destroy({ where: { newCommentId } });
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { findComments, createComment, findComment, updateComment, deleteComment };
