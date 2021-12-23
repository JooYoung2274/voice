const likeService = require("../services/likes");

const likePost = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const { userId: loginUserId } = res.locals.user;
    const processedLike = await likeService.clickLike({ newTrackId, loginUserId });
    return res.status(200).json({ like: processedLike });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { likePost };
