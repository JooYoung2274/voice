const trackModel = require("../services/track");
const tagModel = require("../services/tag");
const trackTagModel = require("../services/tag");
const categoryModel = require("../services/category");
const commentService = require("../services/comments");
const likeService = require("../services/likes");

const myTracksGet = async (req, res, next) => {
  const { userId: loginUserId } = res.locals.user;

  let { userId } = req.params;
  userId = parseInt(userId, 10);

  if (!loginUserId) {
    const tracks = await trackModel.getTracks({ userId });
    res.status(200).send({ tracks });
    return;
  }
  if (loginUserId === userId) {
    const tracks = await trackModel.getTracks({ userId });
    const likes = await likeService.getTracks({ userId });
    res.status(200).send({ tracks, likes });
  }
};

const detailTrackGet = async (req, res, next) => {
  try {
    const { trackId: newTrackId } = req.params;
    const likes = await likeService.findLikes({ newTrackId });
    const track = await trackModel.getTrack({ newTrackId, likes });
    const comments = await commentService.findComments({ newTrackId });

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
    const likes = await trackModel.getLikeTrack();
    // const tracks = await trackModel.getMainTracks();
    // console.log(likes);
    if (!likes) {
      res.sendStatus(400);
      return;
    }

    res.status(200).json({ likes });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const categorySelect = async (req, res, next) => {
  try {
    const { category: newCategory, tag1, tag2, tag3 } = req.query;

    const categoryId = await categoryModel.getCategoryId({ newCategory });

    if (tag1 || tag2 || tag3) {
      const findedTags = await tagModel.getTagIds(tag1, tag2, tag3);

      if (!findedTags.length || !categoryId) {
        res.sendStatus(400);
        return;
      }

      const findedTracks = await trackTagModel.getTrackTag(findedTags, categoryId);
      const likes = await likeService.findLike({ findedTracks });
      const tracks = await trackModel.getSearchedTracks(findedTracks, likes);
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
