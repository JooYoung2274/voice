const userService = require("../services/auth");

//nickname update
const updateNickCon = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { nickname } = req.body;
    const nickcheck = await userService.findNick(nickname);
    if (!nickcheck) {
      await userService.updateNick(userId, nickname);
      return res.sendStatus(200);
    } else if (nickcheck.userId === userId) {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
//user info
const findUserCon = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const userOne = await userService.findUser(userId);
    if (!userOne) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send({ user: userOne });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProfileCon = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { filename } = req.file;
    await userService.updateProfile(userId, filename);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { updateNickCon, findUserCon, updateProfileCon };
