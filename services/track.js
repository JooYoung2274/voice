const { Track } = require("../models/index");
const { TrackTag } = require("../models/index");
const { Category } = require("../models/index");

const createTrack = async ({ categoryId, tagId, thumbnailUrl, trackUrl, script }) => {
  const createdTrack = await Track.create({
    categoryId,
    thumbnailUrl,
    trackUrl,
    script,
  });

  await TrackTag.create({
    trackId: createdTrack.trackId,
    categoryId,
    tagId,
  });

  return createdTrack.trackId;
};

const deleteTrack = async ({ trackId }) => {
  await Track.destory({ where: { trackId } });
  return;
};

const getTracks = async (input) => {
  const tracks = await Track.findAll({
    attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "script"],
    where: input,
  });
  if (!tracks) {
    return;
  }

  let categoryArray = [];
  for (let i = 0; i < tracks.length; i++) {
    const { trackId, categoryId, thumbnailUrl, trackUrl, script } = tracks[i];

    const findedCategory = await Category.findOne({
      attributes: ["category"],
      where: { categoryId: categoryId },
    });
    const category = findedCategory.category;

    const searchedCategory = { trackId, category, thumbnailUrl, trackUrl, script };
    categoryArray.push(searchedCategory);
  }
  return categoryArray;
};

const getTrack = async ({ newTrackId }) => {
  const findedTrack = await Track.findOne({
    attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "script"],
    where: { trackId: newTrackId },
  });

  if (!findedTrack) {
    return;
  }
  const { trackId, categoryId, thumbnailUrl, trackUrl, script } = findedTrack;

  const findedCategory = await Category.findOne({
    attributes: ["category"],
    where: { categoryId: categoryId },
  });

  const category = findedCategory.category;
  const track = { trackId, category, thumbnailUrl, trackUrl, script };

  return track;
};

const getPlainTrack = async ({ newTrackId }) => {
  try {
    const findedTrack = await Track.findOne({
      where: { trackId: newTrackId },
    });
    if (!findedTrack) {
      throw new Error("존재하지 않는 트랙입니다.");
    }
    const { dataValues: trackData } = findedTrack;
    console.log(trackData);
    return trackData;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getSearchedTracks = async (findedTracks) => {
  let tracks = [];
  for (let i = 0; i < findedTracks.length; i++) {
    const findedTrack = await Track.findOne({
      attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "script"],
      where: { trackId: findedTracks[i] },
    });

    const { trackId, categoryId, thumbnailUrl, trackUrl, script } = findedTrack;
    const findedCategory = await Category.findOne({
      attributes: ["category"],
      where: { categoryId: categoryId },
    });
    const category = findedCategory.category;

    const track = { trackId, category, thumbnailUrl, trackUrl, script };
    tracks.push(track);
  }
  return tracks;
};

const getMainTracks = async () => {
  let tracksArray = [];
  let tracks = [];
  for (let i = 1; i < 4; i++) {
    const findedTracks = await Track.findAll({
      attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "script"],
      where: { categoryId: i },
      order: [["categoryId", "DESC"]],
    });
    if (!findedTracks) {
      return;
    }
    let categoryArray = [];

    for (let j = 0; j < findedTracks.length; j++) {
      const { trackId, categoryId, thumbnailUrl, trackUrl, script } = findedTracks[j];
      const findedCategory = await Category.findOne({
        attributes: ["category"],
        where: { categoryId: categoryId },
      });
      const category = findedCategory.category;

      const track = { trackId, category, thumbnailUrl, trackUrl, script };
      categoryArray.push(track);
    }
    tracksArray.push(categoryArray);
  }
  return tracksArray;
};

module.exports = {
  createTrack,
  deleteTrack,
  getTracks,
  getTrack,
  getPlainTrack,
  getMainTracks,
  getSearchedTracks,
};
