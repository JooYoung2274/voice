const { Comment, Track, User } = require("../models");
const { customizedError } = require("../utils/error");

const findCommentsByTrackId = async ({ trackId }) => {
  const findedComments = await Comment.findAll({
    attributes: ["commentId", "userId", "comment"],
    where: { trackId: trackId },
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

const createComment = async ({ comment, trackId, userId }) => {
  try {
    // pramas에 있는 trackId가 실제로 있는 track인지 확인작업
    const findedTrack = await Track.findOne({
      where: { trackId },
    });
    if (!findedTrack) {
      throw customizedError("존재하지 않는 트랙입니다.", 400);
    }
    // 댓글 만들기
    await Comment.create({
      comment,
      trackId,
      userId,
    });
    // 클라이언트에게 줄 댓글 가공
    const result = await Comment.findAll({
      attributes: ["comment", "commentId", "createdAt", "userId"],
      include: {
        model: User,
        attributes: ["nickname", "profileImage"],
      },
      where: { trackId },
      order: [["commentId", "DESC"]],
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const updateComment = async ({ comment, commentId, userId, trackId, nickname }) => {
  try {
    // 댓글 업데이트
    const updated = await Comment.update({ comment }, { where: { commentId, trackId, userId } });
    if (!updated[0]) {
      throw customizedError(
        "존재하지 않는 댓글이거나 트랙에 포함되지 않거나 댓글쓴사람이 아닙니다",
        400,
      );
    }
    // 댓글만 바뀌는 거니까 댓글만 주면 안되나? like처럼 like눌러도 다른건 안주는 것처럼 효과: 밑에있는 findOne제거가능
    // userId,trackId를 통해 comment 있는지 없는지 확인하고 createdAt 뽑음
    const { createdAt } = await Comment.findOne({
      attributes: ["commentId", "createdAt"],
      where: { commentId, trackId, userId },
    });
    // 업데이트된 후 클라이언트에게 줄 댓글 가공
    const result = {
      commentId,
      nickname,
      comment,
      createdAt,
    };
    return result;
  } catch (error) {
    throw error;
  }
};

const deleteComment = async ({ userId, trackId, commentId }) => {
  try {
    // delete 로직
    const deleted = await Comment.destroy({ where: { commentId, trackId, userId } });
    if (!deleted) {
      throw customizedError(
        "존재하지 않는 댓글이거나 트랙에 포함되지 않거나 댓글쓴사람이 아닙니다",
        400,
      );
    }
    // 클라이언트에게 줄 댓글 가공
    results = await Comment.findAll({
      attributes: ["comment", "commentId", "createdAt", "userId"],
      include: {
        model: User,
        attributes: ["nickname", "profileImage"],
      },
      where: { trackId },
      order: [["commentId", "DESC"]],
    });
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findCommentsByTrackId,
  createComment,
  updateComment,
  deleteComment,
};
