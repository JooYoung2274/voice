const chatService = require("../services/chat");

const getChatByIds = async (req, res, next) => {
  try {
    const { page, chat } = req.query;
    const { userId, qUserId } = req.body;
    const arr = [userId, qUserId];
    arr.sort((a, b) => a - b);
    const roomNum = arr[0].toString() + arr[1];
    const getChat = await chatService.getRoomId({
      userId,
      qUserId,
      roomNum,
      page,
      chat,
    });
    await chatService.createChatRoom({ userId, roomNum });
    return res.status(200).send({ getChat });
  } catch (error) {
    next(error);
  }
};

const getChatListByUserId = async (req, res, next) => {
  const { userId } = req.body;
  const result = await chatService.getList({ userId });
  res.status(200).send({ result });
};

const checkNewChat = async (req, res, next) => {
  const { userId } = req.body;
  const roomCheck = await chatService.checkChat({ userId });
  console.log(roomCheck);
  res.status(200).send({ roomCheck });
};

module.exports = { getChatByIds, getChatListByUserId, checkNewChat };
