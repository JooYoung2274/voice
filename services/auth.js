const { Users } = require("../models");

const updateUserByNickname = async ({ userId, nickname }) => {
  try {
    await Users.update(
      { nickname: nickname, nickUnChanged: 0 },
      { where: { userId: userId, nickUnChanged: 1 } },
    );
    return;
  } catch (error) {
    console.log(error);
  }
};

const getUserByUserId = async ({ userId }) => {
  try {
    const userOne = await Users.findOne({
      attributes: ["userId", "email", "nickname", "profileImage", "nickUnChanged"],
      where: { userId: userId },
    });
    if (!userOne) {
      return;
    }
    const result = ({ userId, email, nickname, profile, nickUnChanged } = userOne.dataValues);
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getUserByNickname = async ({ nickname }) => {
  try {
    const userOne = await Users.findOne({ attributes: ["userId"], where: { nickname: nickname } });
    const result = userOne;
    return result;
  } catch (error) {
    console.log(error);
  }
};

const updateUserByFilename = async ({ userId, filename }) => {
  try {
    await Users.update({ profileImage: `uploads/${filename}` }, { where: { userId: userId } });
    return;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { updateUserByNickname, getUserByUserId, getUserByNickname, updateUserByFilename };
