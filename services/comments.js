const { Comments, Track, Users } = require("../models");

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

const findCommentByCommentId = async ({ commentId }) => {
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
    throw error;
  }
};

const createComment = async ({ comment, trackId, userId, nickname }) => {
  try {
    // pramas에 있는 trackId가 실제로 있는 track인지 확인작업
    const findedTrack = await Track.findOne({
      where: { trackId },
    });
    if (!findedTrack) {
      throw new Error("존재하지 않는 트랙입니다.");
    }
    // 댓글 만들기
    const { commentId, createdAt } = await Comments.create({
      comment,
      trackId,
      userId,
    });
    // 클라이언트에게 줄 댓글 가공
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

const updateComment = async ({ comment, commentId, userId, trackId, nickname }) => {
  try {
    // 댓글 업데이트
    const updated = await Comments.update({ comment }, { where: { commentId, trackId, userId } });
    if (!updated[0]) {
      throw new Error("존재하지 않는 댓글이거나 트랙에 포함되지 않거나 댓글쓴사람이 아닙니다");
    }
    // 댓글만 바뀌는 거니까 댓글만 주면 안되나? like처럼 like눌러도 다른건 안주는 것처럼 효과: 밑에있는 findOne제거가능
    // userId,trackId를 통해 comment 있는지 없는지 확인하고 createdAt 뽑음
    const { createdAt } = await Comments.findOne({
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
    const deleted = await Comments.destroy({ where: { commentId, trackId, userId } });
    if (!deleted) {
      throw new Error("존재하지 않는 댓글이거나 트랙에 포함되지 않거나 댓글쓴사람이 아닙니다");
    }
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findComments,
  createComment,
  findCommentByCommentId,
  updateComment,
  deleteComment,
};
