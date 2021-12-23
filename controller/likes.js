const likeService = require("../services/likes");
const trackService = require("../services/track");

const likePost = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const { userId: loginUserId } = res.locals.user;
    const { userId: trackUserId } = await trackService.getPlainTrack({ newTrackId });
    console.log(newTrackId);
    console.log(loginUserId);
    console.log(trackUserId);
    if (loginUserId !== trackUserId) {
      res.sendStatus(400);
      return;
    }
    const processedLike = await likeService.clickLike({ newTrackId, loginUserId });
    return res.status(200).json({ like: processedLike });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { likePost };
