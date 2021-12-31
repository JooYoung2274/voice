const trackService = require("../services/track");
const listInfoService = require("../services/listinfo");

const trackUploads = async (req, res, next) => {
  try {
    const { title, category, tag1, tag2, tag3, trackThumbnailUrlFace } = req.body;
    const { filename } = req.file;
    const { userId } = res.locals.user;
    const tag = [tag1, tag2, tag3];

    const trackId = await trackService.createTrack({
      title,
      category,
      tag,
      trackThumbnailUrlFace,
      filename,
      userId,
    });
    res.status(200).json({ trackId });
  } catch (error) {
    next(error);
  }
};

const trackDelete = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    await trackService.getTrackByTrackId({ trackId, userId });
    await trackService.deleteTrackByTrackId({ trackId });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const trackPage = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    const track = await trackService.getTrackByTrackId({ trackId, userId });
    res.status(200).json({ track });
  } catch (error) {
    next(error);
  }
};

const listInfoGet = async (req, res, next) => {
  try {
    const category = await listInfoService.getCategories();
    const tag = await listInfoService.getTags();
    const trackThumbnail = await listInfoService.getTrackThumbnails();

    res.status(200).json({ category, tag, trackThumbnail });
  } catch (error) {
    next(error);
  }
};

const trackUpdate = async (req, res, next) => {
  try {
    const { title, category, tag1, tag2, tag3, trackThumbnailUrlFace } = req.body;
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    const tag = [tag1, tag2, tag3];

    await trackService.updateTrackByTrackId({
      trackId,
      title,
      tag,
      category,
      trackThumbnailUrlFace,
      userId,
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = { trackUploads, trackDelete, trackPage, listInfoGet, trackUpdate };
