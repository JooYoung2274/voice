const likeService = require("../services/likes");
const trackService = require("../services/track");

const likePost = (req, res, next) => {
  try {
    const { trackId: newtrackId } = req.params;
    const { userId: loginUserId } = res.locals.user;
    const { userId: trackUserId } = trackService.getPlainTrack({ newtrackId });
    if (loginUserId !== trackUserId) {
      res.sendStatus(400);
      return;
    }
    const processedLike = likeService.postLike({ newtrackId, loginUserId });
    return res.status(200).json({ like: processedLike });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { likePost };
