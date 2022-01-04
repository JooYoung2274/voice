const trackService = require("../services/track");

const myTracksGet = async (req, res, next) => {
  try {
    const user = res.locals.user;
    let { userId } = req.params;
    userId = parseInt(userId, 10);

    if (!user.userId || user.userId !== userId) {
      const myPage = false;
      const { results, userDate } = await trackService.getTracksByUserId({ userId, myPage });
      res.status(200).send({ results, userDate });
      return;
    }
    if (user.userId === userId) {
      const myPage = true;
      const { results, likesArray, userDate } = await trackService.getTracksByUserId({
        userId,
        myPage,
      });
      res.status(200).send({ results, likesArray, userDate });
    }
  } catch (error) {
    next(error);
  }
};

// const detailTrackGet = async (req, res, next) => {
//   try {
//     const { trackId } = req.params;
//     const test = true;
//     const likes = await likeService.findLikesByTrackId({ trackId });
//     const track = await trackService.getTrackByTrackId({ trackId, test, likes });
//     const comments = await commentService.findCommentsByTrackId({ trackId });

//     res.status(200).json({ track, comments });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

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
    const { category, tag1, tag2, tag3 } = req.query;
    const tags = [tag1, tag2, tag3];
    const results = await trackService.getTracksForCategory({ tags, category });
    res.status(200).json({ tracks: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { myTracksGet, mainTracksGet, categorySelect };
