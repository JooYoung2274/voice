const { User } = require("../models");
const { customizedError } = require("../utils/error");

const updateUser = async ({ userId, filename, nickname, contact, introduce }) => {
  try {
    const profileImage = `http://54.180.82.210/${filename}`;
    await User.update(
      {
        profileImage: profileImage,
        nickname: nickname,
        contact: contact,
        introduce: introduce,
      },
      { where: { userId: userId } },
    );
    const result = {
      nickname: nickname,
      contact: contact,
      introduce: introduce,
      profileImage: profileImage,
    };
    return result;
  } catch (error) {
    console.log(error);
  }
};
//nickcheck
const getUser = async ({ nickname, userId }) => {
  try {
    const result = User.findOne({ where: { nickname: nickname } });
    if (result.userId !== userId) {
      throw customizedError("사용중인 닉네임입니다", 400);
    }
    return result;
  } catch (error) {
    throw error;
  }
};
module.exports = { updateUser, getUser };
