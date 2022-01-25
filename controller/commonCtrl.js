const trackService = require("../services/track");
const statisticsService = require("../services/statistics.js");

const myTracksGet = async (req, res, next) => {
  try {
    const user = res.locals.user;
    let { userId } = req.params;
    userId = parseInt(userId, 10);
    const tong_gye = await statisticsService.getStatistics({ userId });
    if (!user.userId || user.userId !== userId) {
      const myPage = false;
      const { results, userDate } = await trackService.getTracksByUserId({ userId, myPage });
      res.status(200).send({ results, userDate, tong_gye });
      return;
    }
    if (user.userId === userId) {
      const myPage = true;
      const { results, likesArray, userDate } = await trackService.getTracksByUserId({
        userId,
        myPage,
      });
      res.status(200).send({ results, likesArray, userDate, tong_gye });
    }
  } catch (error) {
    next(error);
  }
};

const mainTracksGet = async (req, res, next) => {
  try {
    const results = await trackService.getTracksForMain();
    res.status(200).json({ totalTracks: results });
  } catch (error) {
    next(error);
  }
};

const categorySelect = async (req, res, next) => {
  try {
    const { category, tag1, tag2, tag3, page, track } = req.query;
    const tags = [tag1, tag2, tag3];
    const results = await trackService.getTracksForCategory({ tags, category, page, track });
    res.status(200).json({ tracks: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { myTracksGet, mainTracksGet, categorySelect };
