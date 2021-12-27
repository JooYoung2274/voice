const trackService = require("../services/track");
const listInfoService = require("../services/listinfo");
const tagService = require("../services/tag");

const trackUploads = async (req, res, next) => {
  try {
    const { category, tag1, tag2, tag3, trackThumbnailUrl } = req.body;
    const { trackFile } = req.files;
    const { userId } = res.locals.user;
    const tag = [tag1, tag2, tag3];

    if (!trackFile || !trackThumbnailUrl || !category || !tag) {
      res.sendStatus(400);
      return;
    }
    const trackUrlName = req.files.trackFile[0].filename;

    await trackService.createTrack({
      category,
      tag,
      trackThumbnailUrl,
      trackUrlName,
      userId,
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackDelete = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;

    const track = await trackService.getTrackByTrackId({ trackId });

    if (!track || userId !== track.userId) {
      res.sendStatus(400);
      return;
    }
    await trackService.deleteTrackByTrackId({ trackId });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackPage = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const { userId } = res.locals.user;

    const track = await trackService.getTrackByTrackId({ trackId });

    if (!track || userId !== track.userId) {
      res.sendStatus(400);
      return;
    }
    res.status(200).json({ track });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const listInfoGet = async (req, res, next) => {
  try {
    const category = await listInfoService.getCategories();
    const tag = await listInfoService.getTags();
    const trackThumbnail = await listInfoService.getTrackThumbnails();

    if (!category || !tag || !trackThumbnail) {
      res.sendStatus(400);
      return;
    }
    res.status(200).json({ category, tag, trackThumbnail });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackUpdate = async (req, res, next) => {
  try {
    const { category, tag1, tag2, tag3, trackThumbnailUrl } = req.body;
    const { trackId } = req.params;
    const { trackFile } = req.files;
    const { userId } = res.locals.user;
    const tag = [tag1, tag2, tag3];

    if (!trackFile || !trackThumbnailUrl || !category || !tag) {
      res.sendStatus(400);
      return;
    }
    const trackUrlName = req.files.trackFile[0].filename;
    // trackTag 에서 삭제, 생성
    const findedTrack = await trackService.getTrackByTrackId({ trackId, likes });

    if (findedTrack.userId !== userId) {
      res.sendStatus(400);
      return;
    }

    const track = await trackService.updateTrackByTrackId({
      trackId,
      tag,
      deleteTag,
      category,
      trackUrlName,
      trackThumbnailUrl,
    });
    res.status(200).json({ track });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { trackUploads, trackDelete, trackPage, listInfoGet, trackUpdate };
