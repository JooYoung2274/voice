const likeService = require("../services/like");

const likePost = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    const result = await likeService.createOrDeleteLike({ trackId, userId });
    return res.status(200).json({ like: result });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports = { likePost };
