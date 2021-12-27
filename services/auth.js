const { Users } = require("../models");

const updateUser = async ({ userId, filename, nickname, contact, introduce }) => {
  try {
    let profileImage = "";
    if (filename) {
      profileImage = `uploads/${filename}`;
    }
    await Users.update(
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
    console.log(error);
  }
};
//nickcheck
const getUser = async ({ nickname }) => {
  try {
    const result = Users.findOne({ where: { nickname: nickname } });
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { updateUser, getUser };
