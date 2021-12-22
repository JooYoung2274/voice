const { Comments } = require("../models/index");

const findComments = (trackId) => {
  return Comments.findAll({ where: { trackId } });
};

const findComment = (commentId) => {
  return Comments.findOne({ where: { commentId } });
};

// track 추가하면
// const createComment = (trackId, comment, userId) => {
//     const commentData = Comments.create({
//       trackId,
//       comment,
//       userId,
//     });
//     return commentData;

// };

const createComment = (comment) => {
  return Comments.create({
    comment,
  });
};

const updateComment = (comment, commentId) => {
  return Comments.update({ comment }, { where: { commentId } });
};

const deleteComment = (commentId) => {
  return Comments.destroy({ where: { commentId } });
};

module.exports = { findComments, createComment, findComment, updateComment, deleteComment };
