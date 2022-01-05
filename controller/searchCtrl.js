const searchService = require("../services/track");

const searchGet = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const results = await searchService.getTracksForSearch({ keyword });
    return res.status(200).json({ tracks: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchGet };
