const { Comments } = require("../models/index");
const CommentClass = require("../classes/comments");
const { Track } = require("../models/index");

const findComments = ({ trackId }) => {
  return Comments.findAll({ where: { trackId } });
};

const findComment = async ({ newCommentId }) => {
  try {
    const comment = await Comments.findOne({
      where: { commentId: newCommentId },
    });
    if (!comment) {
      throw Error("존재하지 않는 댓글입니다");
    }
    const { dataValues: commentData } = comment;
    return commentData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createComment = async ({ newComment, newTrackId, loginUserId, loginNickname }) => {
  try {
    // 유효한 trackId가 아닐때
    const findedTrack = await Track.findOne({
      where: { trackId: newTrackId },
    });
    if (!findedTrack) {
      throw new Error("유효한 trackId가 아닙니다.");
    }
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
    return error;
  }
};

const updateComment = async ({
  newComment,
  newCommentId,
  loginNickname,
  createdAt,
  newTrackId,
}) => {
  try {
    const {
      dataValues: { trackId: commentTrackId },
    } = await Comments.findOne({ where: { commentId: newCommentId } });
    // parameter거쳐서 온 newTrackId는 str이고 commentTrackId는 db에 int상태로 저장됨
    if (Number(newTrackId) !== commentTrackId) {
      throw new Error("댓글 수정에 유효하지 않은 api요청입니다");
    }
    await Comments.update({ comment: newComment }, { where: { commentId: newCommentId } });
    const commentObj = new CommentClass.CommentForm({
      commentId: newCommentId,
      nickname: loginNickname,
      comment: newComment,
      createdAt: createdAt,
    });
    return commentObj;
  } catch (error) {
    console.log(error);
    // throw Error(error)?
    return error;
  }
};

const deleteComment = async ({ newTrackId, newCommentId }) => {
  try {
    const {
      dataValues: { trackId: commentTrackId },
    } = await Comments.findOne({ where: { commentId: newCommentId } });
    // parameter거쳐서 온 newTrackId는 str이고 commentTrackId는 db에 int상태로 저장됨
    if (Number(newTrackId) !== commentTrackId) {
      throw new Error("댓글 수정에 유효하지 않은 api요청입니다");
    }
    // 에러나면 왜 그냥 될까 여기 {commentId:newCommentId} 대신 {newCommentId}되면 에러는 나는데 그냥통과됨
    await Comments.destroy({ where: { commentId: newCommentId } });
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { findComments, createComment, findComment, updateComment, deleteComment };
