const trackService = require("../services/track");
const listInfoService = require("../services/listinfo");

const trackUploads = async (req, res, next) => {
  try {
    const { title, category, tag1, tag2, tag3, trackThumbnailId, device } = req.body;
    const { location } = req.file;
    const { userId } = res.locals.user;
    const tags = [tag1, tag2, tag3];
    const trackId = await trackService.createTrack({
      title,
      category,
      tags,
      trackThumbnailId,
      location,
      userId,
      device,
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
    const track = await trackService.getTrackByTrackId({ trackId });
    res.status(200).json({ track });
  } catch (error) {
    next(error);
  }
};

const listInfoGet = async (req, res, next) => {
  try {
    const categories = await listInfoService.getCategories();
    const tags = await listInfoService.getTags();
    const trackThumbnails = await listInfoService.getTrackThumbnails();

    res.status(200).json({ categories, tags, trackThumbnails });
  } catch (error) {
    next(error);
  }
};

const trackUpdate = async (req, res, next) => {
  try {
    const { title, category, tag1, tag2, tag3, trackThumbnailId } = req.body;
    const { trackId } = req.params;
    const { userId } = res.locals.user;
    const tags = [tag1, tag2, tag3];

    await trackService.updateTrackByTrackId({
      trackId,
      title,
      tags,
      category,
      trackThumbnailId,
      userId,
    });

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const listUpdate = async (req, res, next) => {
  try {
    const { trackId } = req.body;
    const { userId } = res.locals.user;
    await trackService.updateListByTrackId({ trackId, userId });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const listGet = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { playlist } = await trackService.getListByUserId({ userId });
    res.status(200).json({ playlist });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  trackUploads,
  trackDelete,
  trackPage,
  listInfoGet,
  trackUpdate,
  listUpdate,
  listGet,
};
