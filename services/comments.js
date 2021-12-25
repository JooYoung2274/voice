const { Comments } = require("../models/index");
const CommentClass = require("../classes/comments");
const { Track } = require("../models/index");

const findComments = async ({ newTrackId }) => {
  const findedComments = await Comments.findAll({
    attributes: ["commentId", "userId", "comment"],
    where: { trackId: newTrackId },
    order: [["commentId", "DESC"]],
  });

  let comments = [];
  for (let i = 0; i < findedComments.length; i++) {
    const { commentId, userId, comment } = findedComments[i];
    const findedcomment = { commentId, userId, comment };
    comments.push(findedcomment);
  }
  return comments;
};

const findComment = async ({ commentId }) => {
  try {
    const comment = await Comments.findOne({
      where: { commentId },
    });
    if (!comment) {
      throw Error("존재하지 않는 댓글입니다");
    }
    const { dataValues: result } = comment;
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const createComment = async ({ comment, trackId, userId, nickname }) => {
  try {
    // 유효한 trackId가 아닐때
    const findedTrack = await Track.findOne({
      where: { trackId },
    });
    if (!findedTrack) {
      throw new Error("유효한 trackId가 아닙니다.");
    }
    const {
      comment: dbComment,
      commentId,
      createdAt,
    } = await Comments.create({
      comment,
      trackId,
      userId,
    });
    // comment는 db에 있는거 안쓰고 클라이언트가 준거 그대로 쓰는거 괜찮나?
    const result = {
      commentId,
      nickname,
      comment: dbComment,
      createdAt,
    };
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const updateComment = async ({ comment, commentId, nickname, createdAt, trackId }) => {
  try {
    const {
      dataValues: { trackId: commentTrackId, commentId: dbCommentId },
    } = await Comments.findOne({ where: { commentId } });
    // parameter거쳐서 온 trackId는 str이고 commentTrackId는 db에 int상태로 저장됨
    if (Number(trackId) !== commentTrackId) {
      throw new Error("댓글 수정에 유효하지 않은 api요청입니다");
    }
    await Comments.update({ comment }, { where: { commentId } });
    const result = {
      commentId: dbCommentId,
      nickname,
      comment,
      createdAt: createdAt,
    };
    return result;
  } catch (error) {
    console.log(error);
    // throw Error(error)?
    return error;
  }
};

const deleteComment = async ({ trackId, commentId }) => {
  try {
    const {
      dataValues: { trackId: commentTrackId },
    } = await Comments.findOne({ where: { commentId } });
    // parameter거쳐서 온 newTrackId는 str이고 commentTrackId는 db에 int상태로 저장됨
    if (Number(trackId) !== commentTrackId) {
      throw new Error("댓글 수정에 유효하지 않은 api요청입니다");
    }
    // 에러나면 왜 그냥 될까 여기 {commentId:commentId} 대신 {commentId}되면 에러는 나는데 그냥통과됨
    await Comments.destroy({ where: { commentId } });
    return;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { findComments, createComment, findComment, updateComment, deleteComment };
