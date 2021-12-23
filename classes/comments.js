class CommentForm {
  constructor({ commentId, nickname, comment, createdAt }) {
    this.commentId = commentId;
    this.nickname = nickname;
    this.comment = comment;
    this.createdAt = createdAt;
  }
}

module.exports = { CommentForm };
