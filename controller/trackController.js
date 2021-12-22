const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const categoryModel = require("../services/category");

const trackUploads = async (req, res, next) => {
  try {
    const { category, tag, script } = req.body;
    const thumbnailUrl = req.files.thumbnailUrl[0].filename;
    const trackUrl = req.files.trackUrl[0].filename;
    if (!category || !tag || !script || !thumbnailUrl || !trackUrl) {
      return res.sendStatus(400);
    }
    const categoryId = await categoryModel.findModel(category);
    const tracks = await trackModel.createTrack(
      categoryId,
      thumbnailUrl,
      trackUrl,
      script
    );
    const trackId = tracks.trackId;
    await tagModel.createModel(tag, trackId);
    res.status(200).json({ tracks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackDelete = async (req, res, next) => {
  try {
    const { trackId } = res.params;
    await trackModel.deleteTrack(trackId);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { trackUploads, trackDelete };
