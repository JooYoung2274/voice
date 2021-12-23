const userService = require("../services/auth");

//nickname update
const updateNickCon = async (req, res, next) => {
  try {
    const { userId } = res.locals.user;
    const { nickname } = req.body;
    await userService.updateNick(userId, nickname);
    res.sendStatus(200);
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

module.exports = { updateNickCon, findUserCon };
