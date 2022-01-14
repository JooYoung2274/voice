const chatService = require("../services/chat");

const getChatByIds = async (req, res, next) => {
  try {
    const { userId, qUserId } = req.body;
    const arr = [userId, qUserId];
    arr.sort((a, b) => a - b);
    const roomNum = arr[0].toString() + arr[1];
    const getchat = await chatService.getRoomId({ roomNum });
    await chatService.createChatRoom({ userId, roomNum });
    return res.status(200).send({ getchat });
  } catch (error) {
    next(error);
  }
};

module.exports = { getChatByIds };
