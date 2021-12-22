const { Track } = require("../models/index");

const createTrack = async (categoryId, thumbnailUrl, trackUrl, script) => {
  const createdTrack = await Track.create({
    categoryId: categoryId,
    thumbnailUrl: thumbnailUrl,
    trackUrl: trackUrl,
    script: script,
  });
  let track = {};
  track["trackId"] = createdTrack.trackId;
  track["categoryId"] = createdTrack.categoryId;
  track["thumbnailUrl"] = createdTrack.thumbnailUrl;
  track["trackUrl"] = createdTrack.trackUrl;
  track["script"] = createdTrack.script;
  return track;
};

const deleteTrack = async (trackId) => {
  await Track.destory({ where: { trackId: trackId } });
  return;
};

const getTracks = async (input) => {
  const tracks = await Track.findAll({ where: { userId: input } });
  console.log(tracks);
};

const getTrack = async (input) => {
  const findedTrack = await Track.findOne({
    attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "script"],
    where: { trackId: input },
  });
  const { trackId, categoryId, thumbnailUrl, trackUrl, script } = findedTrack;
  let track = {};
  track["trackId"] = trackId;
  track["categoryId"] = categoryId;
  track["thumbnailUrl"] = thumbnailUrl;
  track["trackUrl"] = trackUrl;
  track["script"] = script;
  console.log(track);
  return track;
};

const getMainTracks = async () => {
  let tracksArray = [];
  for (let i = 1; i < 4; i++) {
    const findedTracks = await Track.findAll({
      attributes: ["trackId", "categoryId", "thumbnailUrl", "trackUrl", "script"],
      where: { categoryId: i },
      order: [["categoryId", "DESC"]],
    });
    let categoryArray = [];
    for (let j = 0; j < findedTracks.length; j++) {
      let track = {};
      const { trackId, categoryId, thumbnailUrl, trackUrl, script } = findedTracks[j];
      track["trackId"] = trackId;
      track["categoryId"] = categoryId;
      track["thumbnailUrl"] = thumbnailUrl;
      track["trackUrl"] = trackUrl;
      track["script"] = script;
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
  getMainTracks,
};
