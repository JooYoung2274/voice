const chatService = require("../services/chat");

const getChatByIds = async (req, res, next) => {
  try {
    const { page, chat } = req.query;
    const { userId, qUserId } = req.body;
    const arr = [userId, qUserId];
    arr.sort((a, b) => a - b);
    const roomNum = arr[0].toString() + arr[1];
    const { getChat, profile } = await chatService.getRoomId({
      userId,
      qUserId,
      roomNum,
      page,
      chat,
    });
    await chatService.createChatRoom({ userId, roomNum });
    return res.status(200).send({ getChat, profile });
  } catch (error) {
    next(error);
  }
};

module.exports = { getChatByIds };
