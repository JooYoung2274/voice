const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const trackTagModel = require("../services/tag");
const commentService = require("../services/comment");
const likeService = require("../services/like");

const myTracksGet = async (req, res, next) => {
  try {
    const user = res.locals.user;
    let { userId } = req.params;
    userId = parseInt(userId, 10);

    if (!user.userId || user.userId !== userId) {
      const myPage = false;
      const tracks = await trackModel.getTracksByUserId({ userId, myPage });
      res.status(200).send({ tracks });
      return;
    }
    if (user.userId === userId) {
      const myPage = true;
      const { tracks, likesArray } = await trackModel.getTracksByUserId({ userId, myPage });
      res.status(200).send({ tracks, likesArray });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const detailTrackGet = async (req, res, next) => {
  try {
    const { trackId } = req.params;
    const likes = await likeService.findLikesByTrackId({ trackId });
    const track = await trackModel.getTrackByTrackId({ trackId, likes });
    const comments = await commentService.findCommentsByTrackId({ trackId });

    if (!track) {
      res.sendStatus(400);
      return;
    }
    res.status(200).json({ track, comments });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const mainTracksGet = async (req, res, next) => {
  try {
    const x = "1";
    const { categoryTracks, totalTracks } = await trackModel.getTracks();

    if (!categoryTracks || !totalTracks) {
      res.sendStatus(400);
      return;
    }
    res.status(200).json({ categoryTracks, totalTracks });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const categorySelect = async (req, res, next) => {
  try {
    const { category, tag1, tag2, tag3 } = req.query;
    const tag = [tag1, tag2, tag3];
    if (!category) {
      res.sendStatus(400);
      return;
    }
    if (tag1 !== "") {
      const findedTrackIds = await trackTagModel.getTrackIdsByTag({ tag, category });
      // console.log(findedTrackIds.length);
      //일단 likes 구해서 리턴함.. sequelize sub query 방법 찾아야함..
      // const likes = await likeService.getLikeByTracks({ findedTrackIds });
      const tracks = await trackModel.getTracksByLikes({ findedTrackIds });
      res.status(200).json({ tracks });
      return;
    } else {
      const tracks = await trackModel.getTracksByCategory({ category });
      res.status(200).json({ tracks });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { myTracksGet, detailTrackGet, mainTracksGet, categorySelect };
