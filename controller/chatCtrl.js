const chatService = require("../services/chat");

const roomNumMaker = (x, y) => {
  const arr = [x, y];
  arr.sort((a, b) => a - b);
  roomNum = arr[0].toString() + arr[1];
};

const getChatByIds = async (req, res, next) => {
  try {
    const { page, chat } = req.query;
    const { userId, qUserId } = req.body;
    roomNumMaker(userId, qUserId);
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
    const { userId } = req.body;
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
    res.status(200).send({ roomCheck });
  } catch (error) {
    next(error);
  }
};

const postTrack = async (req, res, next) => {
  try {
    const { location } = req.file;
    const chatText = location;
    const checkChat = false;
    const { sendUserId, receiveUserId, sample } = req.body;
    roomNumMaker(sendUserId, receiveUserId);
    const chatType = "audio";
    await chatService.createChat({
      roomNum,
      sendUserId,
      receiveUserId,
      chatText,
      checkChat,
      chatType,
      sample,
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const postImage = async (req, res, next) => {
  const { sendUserId, receiveUserId } = req.body;
  const { location } = req.file;
  roomNumMaker(sendUserId, receiveUserId);
  const chatText = location;
  const chatType = "image";
  const checkChat = false;
  const sample = null;
  await chatService.createChat({
    roomNum,
    sendUserId,
    receiveUserId,
    chatText,
    checkChat,
    chatType,
    sample,
  });
  res.sendStatus(200);
};

module.exports = { getChatByIds, getChatListByUserId, checkNewChat, postTrack, postImage };
