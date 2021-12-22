const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const categoryModel = require("../services/category");

const myPagetTracksGet = async (req, res, next) => {
  const { userId } = req.params;
  const tracks = trackModel.getTracks(userId);
};

const detailTrackGet = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const track = await trackModel.getTrack(trackId);
    res.status(200).json(track);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const mainPageTracksGet = async (rea, res, nexr) => {
  try {
    const tracks = trackModel.getMainTracks();
    res.status(200).json({ tracks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = { myPagetTracksGet, detailTrackGet, mainPageTracksGet };
