const userService = require("../services/auth");

//nickname update
const updateNickCon = async (req, res, next) => {
  try {
    const { userId: userId } = res.locals.user;
    const { nickname: nickname } = req.body;
    const nickcheck = await userService.getUserByNickname({ nickname });
    if (!nickcheck) {
      await userService.updateUserByNickname({ userId, nickname });
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
    const { userId: userId } = res.locals.user;
    const userOne = await userService.getUserByUserId({ userId });
    if (!userOne) {
      res.sendStatus(404);
      return;
    }
    const result = userOne;
    res.status(200).send({ user: result });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProfileCon = async (req, res, next) => {
  try {
    const { userId: userId } = res.locals.user;
    const { filename: filename } = req.file;
    await userService.updateUserBy({ userId, filename });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { updateNickCon, findUserCon, updateProfileCon };
