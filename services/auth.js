const { User } = require("../models");
const { customizedError } = require("../utils/error");

const getUserBy = async (col) => {
  try {
    const findedUser = await User.findOne({
      attributes: ["nickname", "contact", "profileImage", "introduce"],
      where: col,
    });
    return findedUser;
  } catch (error) {
    throw error;
  }
};

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
      if (findedUser.userId !== userId){
      throw customizedError("사용중인 닉네임입니다", 400);
      }
    }
    if (nickname.length < 4 || nickname.length > 15) {
      throw customizedError("닉네임은 4자이상 15자 이하여야 합니다.", 400);
    }
    const nickCheck = nickname.match(/^[a-zA-Zㄱ-힣0-9]*$/);
    if (!nickCheck) {
      throw customizedError("닉네임에 특수문자를 포함할 수 없습니다.", 400);
    }
    if (contact) {
      const emailCheck = contact.match(/^([a-z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-z\.]{2,6})$/);
      if (!emailCheck) throw customizedError("이메일 형식이 올바르지 않습니다.", 400);
    }
    if (introduce.length > 100) {
      throw customizedError("자기 소개는 50자를 넘길 수 없습니다.", 400);
    }
    if (reqFile) {
      const { filename } = reqFile;
      const profileImage = `http://${process.env.HOST}/${filename}`;
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
