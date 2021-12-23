const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const categoryModel = require("../services/category");
const userService = require("../services/auth");
const likeService = require("../services/likes");

const trackUploads = async (req, res, next) => {
  try {
    const { category, tag } = req.body;
    const { thumbnailUrl, trackUrl } = req.files;

    if (!thumbnailUrl || !trackUrl) {
      res.sendStatus(400);
      return;
    }
    const newThumbnailUrl = req.files.thumbnailUrl[0].filename;
    const newTrackUrl = req.files.trackUrl[0].filename;
    const { userId: loginUserId } = res.locals.user;

    const categoryId = await categoryModel.getCategoryId({ category });
    const tagId = await tagModel.getTagId({ tag });

    if (!categoryId || !tagId) {
      res.sendStatus(400);
      return;
    }

    await trackModel.createTrack({
      categoryId,
      tagId,
      newThumbnailUrl,
      newTrackUrl,
      loginUserId,
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackDelete = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const { userId } = res.locals.user;

    const user = await userService.findUser({ userId });
    const track = await trackModel.getTrack({ newTrackId });

    if (!track || user.userId !== track.userId) {
      res.sendStatus(400);
      return;
    }

    await trackModel.deleteTrack({ newTrackId });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackPage = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const { userId } = res.locals.user;
    const likes = await likeService.findLikes({ newTrackId });
    const user = await userService.findUser({ userId });
    const track = await trackModel.getTrack({ newTrackId, likes });

    if (!track || user.userId !== track.userId) {
      res.sendStatus(400);
      return;
    }

    res.status(200).json({ track });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { trackUploads, trackDelete, trackPage };
