const chatService = require("../services/chat");
//testestetset
const getChatByIds = async (req, res, next) => {
  try {
    const { page, chat } = req.query;
    const { userId, qUserId } = req.body;
    console.log(userId, qUserId);
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
    await chatService.createChatRoom({ userId, qUserId, roomNum });
    return res.status(200).send({ getChat });
  } catch (error) {
    next(error);
  }
};

const getChatListByUserId = async (req, res, next) => {
  try {
    console.log(req.body);
    const { userId } = req.body;
    console.log(userId);
    const result = await chatService.getList({ userId });
    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
};

const checkNewChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const roomCheck = await chatService.checkChat({ userId });
    console.log(roomCheck);
    res.status(200).send({ roomCheck });
  } catch (error) {
    next(error);
  }
};

const postTrack = async (req, res, next) => {
  try {
    const { location } = req.file;
    const chatText = location;
    console.log(req.file);
    const checkChat = false;
    const { sendUserId, receiveUserId } = req.body;
    const arr = [sendUserId, receiveUserId];
    arr.sort((a, b) => a - b);
    roomNum = arr[0].toString() + arr[1];
    // const { userId } = res.locals.user;
    const chatType = "url";
    await chatService.createChat({
      roomNum,
      sendUserId,
      receiveUserId,
      chatText,
      checkChat,
      chatType,
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

module.exports = { getChatByIds, getChatListByUserId, checkNewChat, postTrack };
