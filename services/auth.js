const { User } = require("../models");
const { customizedError } = require("../utils/error");

const updateUser = async ({ userId, filename, nickname, contact, introduce }) => {
  try {
    const profileImage = `http://13.125.215.6/${filename}`;
    if (nickname.length < 4 || nickname.length > 15) {
      throw customizedError("닉네임은 4자이상 15자 이하여야 합니다.", 400);
    }
    let nickCheck = nickname.match(/^[a-zA-Zㄱ-힣0-9]*$/);
    if (!nickCheck) {
      throw customizedError("닉네임에 특수문자를 포함할 수 없습니다.", 400);
    }
    if (contact) {
      let emailCheck = contact.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
      if (!emailCheck) throw customizedError("이메일 형식이 올바르지 않습니다.", 400);
    }
    await User.update(
      {
        profileImage: profileImage,
        nickname: nickname,
        contact: contact,
        introduce: introduce,
      },
      { where: { userId: userId } },
    );
    return;
  } catch (error) {
    throw error;
  }
};
//nickcheck
const getUserByNickname = async ({ nickname, userId }) => {
  try {
    const result = await User.findOne({ where: { nickname: nickname } });
    if (result) {
      if (result.userId !== userId) {
        throw customizedError("사용중인 닉네임입니다", 400);
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
};
const getUserByUserId = async ({ userId }) => {
  try {
    const userOne = await User.findOne({ where: { userId: userId } });
    const { nickname, contact, profileImage, introduce } = userOne;
    const result = {
      userId: userId,
      nickname: nickname,
      contact: contact,
      profileImage: profileImage,
      introduce: introduce,
    };
    return result;
  } catch (error) {
    throw error;
  }
};
module.exports = { updateUser, getUserByNickname, getUserByUserId };
