const likeService = require("../services/like");

const likePost = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    const result = await likeService.createOrDeleteLike({ trackId, userId });
    return res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
};

module.exports = { likePost };
