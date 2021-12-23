const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const trackTagModel = require("../services/tag");
const categoryModel = require("../services/category");

const myTracksGet = async (req, res, next) => {
  const { userId } = req.params;
  const tracks = trackModel.getTracks({ userId });
};

const detailTrackGet = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const track = await trackModel.getTrack({ newTrackId });

    if (!track) {
      res.sendStatus(400);
      return;
    }

    res.status(200).json({ track });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const mainTracksGet = async (req, res, next) => {
  try {
    const tracks = await trackModel.getMainTracks();

    if (!tracks) {
      res.sendStatus(400);
      return;
    }

    res.status(200).json({ tracks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const categorySelect = async (req, res, next) => {
  try {
    const { category, tag1, tag2, tag3 } = req.query;
    const categoryId = await categoryModel.getCategoryId({ category });

    if (tag1 || tag2 || tag3) {
      const findedTags = await tagModel.getTagIds(tag1, tag2, tag3);

      if (!findedTags.length || !categoryId) {
        res.sendStatus(400);
        return;
      }

      const findedTracks = await trackTagModel.getTrackTag(findedTags, categoryId);
      const tracks = await trackModel.getSearchedTracks(findedTracks);
      res.status(200).json({ tracks });
    } else {
      const tracks = await trackModel.getTracks({ categoryId });
      res.status(200).json({ tracks });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { myTracksGet, detailTrackGet, mainTracksGet, categorySelect };
