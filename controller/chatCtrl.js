const chatService = require("../services/chat");

const roomNumMaker = (x, y) => {
  const arr = [x, y];
  arr.sort((a, b) => a - b);
  let roomNum = arr[0].toString() + arr[1];
  return roomNum;
};

const getChatByIds = async (req, res, next) => {
  try {
    const { page, chat } = req.query;
    const { userId, qUserId } = req.body;
    const roomNum = await roomNumMaker(userId, qUserId);
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
    const { sendUserId, receiveUserId, sample } = req.body;
    const { location } = req.file;
    // const chatText = location;
    const checkChat = false;
    const chatType = "audio";
    const roomNum = await roomNumMaker(sendUserId, receiveUserId);

    await chatService.createChat({
      roomNum,
      sendUserId,
      receiveUserId,
      location,
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
  try {
    const { sendUserId, receiveUserId } = req.body;
    const { location } = req.file;
    const chatText = location;
    const checkChat = false;
    const chatType = "image";
    const sample = null;
    const roomNum = await roomNumMaker(sendUserId, receiveUserId);
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

module.exports = { getChatByIds, getChatListByUserId, checkNewChat, postTrack, postImage };
