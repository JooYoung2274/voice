const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const categoryModel = require("../services/category");

const trackUploads = async (req, res, next) => {
  try {
    const { category, tag, script } = req.body;
    const thumbnailUrl = req.files.thumbnailUrl[0].filename;
    const trackUrl = req.files.trackUrl[0].filename;
    const { userId: loginUserId } = res.locals.user;

    const categoryId = await categoryModel.getCategoryId({ category });
    const tagId = await tagModel.getTagId({ tag });
    await trackModel.createTrack({
      categoryId,
      tagId,
      thumbnailUrl,
      trackUrl,
      script,
      loginUserId,
    });

    if (!categoryId || !tagId || !thumbnailUrl || !trackUrl) {
      res.sendStatus(400);
      return;
    }

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackDelete = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const track = await trackModel.getTrack({ trackId });

    if (!track) {
      res.sendStatus(400);
    }

    await trackModel.deleteTrack({ trackId });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackPage = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const track = await trackModel.getTrack({ newTrackId });

    if (!track) {
      res.sendStatus(400);
    }

    res.status(200).json({ track });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { trackUploads, trackDelete, trackPage };
