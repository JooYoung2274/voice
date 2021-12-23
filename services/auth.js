const { Users } = require("../models");

const updateNick = async (userId, nickname) => {
  try {
    await Users.update({ nickname: nickname, nickUnChanged: 0 }, { where: { userId: userId, nickUnChanged: 1 } });
    return;
  } catch (error) {
    console.log(error);
  }
};

const findUser = async (userId) => {
  try {
    const userOne = await Users.findOne({ attributes: ["userId", "email", "nickname", "profileImage", "nickUnChanged"], where: { userId: userId } });
    if (!userOne) {
      return;
    }
    return userOne;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { updateNick, findUser };
