const likeService = require("../services/like");

const likePost = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    await likeService.createOrDeleteLike({ trackId, userId });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = { likePost };
