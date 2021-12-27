const trackService = require("../services/track");
const listInfoService = require("../services/listinfo");

const trackUploads = async (req, res, next) => {
  try {
    const { title, category, tag1, tag2, tag3, trackThumbnailUrl } = req.body;
    const { trackFile } = req.files;
    const { userId } = res.locals.user;
    const tag = [tag1, tag2, tag3];

    await trackService.createTrack({
      title,
      category,
      tag,
      trackThumbnailUrl,
      trackFile,
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

    if (userId !== track.userId) {
      throw customizedError("권한이 없습니다.", 400);
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

    if (userId !== track.userId) {
      throw customizedError("권한이 없습니다.", 400);
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

    res.status(200).json({ category, tag, trackThumbnail });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const trackUpdate = async (req, res, next) => {
  try {
    const { title, category, tag1, tag2, tag3, trackThumbnailUrl } = req.body;
    const { trackId } = req.params;
    const { trackFile } = req.files;
    const { userId } = res.locals.user;
    const tag = [tag1, tag2, tag3];

    // trackTag 에서 삭제, 생성
    const findedTrack = await trackService.getTrackByTrackId({ trackId, likes });

    if (findedTrack.userId !== userId) {
      throw customizedError("권한이 없습니다.", 400);
    }

    const track = await trackService.updateTrackByTrackId({
      trackId,
      title,
      tag,
      deleteTag,
      category,
      trackFile,
      trackThumbnailUrl,
    });

    res.status(200).json({ track });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { trackUploads, trackDelete, trackPage, listInfoGet, trackUpdate };
