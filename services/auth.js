const { User } = require("../models");
const { customizedError } = require("../utils/error");
const { MESSAGE } = require("../config/constants");

const getUserBy = async (col) => {
  try {
    const findedUser = await User.findOne({
      attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
      where: col,
    });
    return findedUser;
  } catch (error) {
    throw error;
  }
};

//test
const getUserByNickname = async ({ nickname }) => {
  const result = await getUserBy({ nickname });
  return result;
};

const getUserByUserId = async ({ userId }) => {
  const result = await getUserBy({ userId });
  return result;
};

const updateUser = async ({ userId, reqFile, nickname, contact, introduce }) => {
  try {
    const findedUser = await getUserByNickname({ nickname });
    if (findedUser) {
      if (findedUser.userId !== userId) {
        throw customizedError(MESSAGE.NICK_USED, 400);
      }
    }
    if (nickname.length < 4 || nickname.length > 15) {
      throw customizedError(MESSAGE.NICK_LENGTH, 400);
    }
    const nickCheck = nickname.match(/^[a-zA-Zㄱ-힣0-9]*$/);
    if (!nickCheck) {
      throw customizedError(MESSAGE.NICK_VALIDATE, 400);
    }
    if (contact) {
      const emailCheck = contact.match(/^([a-z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-z\.]{2,6})$/);
      if (!emailCheck) throw customizedError(MESSAGE.EMAIL_VALIDATE, 400);
    }
    if (introduce.length > 100) {
      throw customizedError(MESSAGE.INTRODUCE, 400);
    }
    if (reqFile) {
      const { location } = reqFile;
      const profileImage = `${location}`;
      await User.update(
        {
          profileImage,
          nickname,
          contact,
          introduce,
        },
        { where: { userId } },
      );
      return;
    }
    await User.update(
      {
        nickname,
        contact,
        introduce,
      },
      { where: { userId } },
    );
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { updateUser, getUserByNickname, getUserByUserId };
