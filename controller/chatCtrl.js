const chatService = require("../services/chat");
const { randomFilename } = require("../middleware/uploader");
const { convertAndSaveS3 } = require("../utils/converter");

const { S3_HOST, TRACKS } = process.env;
const { DIRECTORY } = require("../config/constants");

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
    const { sendUserId, receiveUserId, sample, device } = req.body;
    const { location } = req.file;
    const chatText = location;
    const checkChat = false;
    const chatType = DIRECTORY.AUDIO;
    const roomNum = await roomNumMaker(sendUserId, receiveUserId);

    if (device !== DIRECTORY.IPHONE) {
      const ranFileName = `${randomFilename()}.mp3`;
      const newLocation = `${S3_HOST}/${DIRECTORY.TRACKS}}/${ranFileName}`;
      await convertAndSaveS3(ranFileName, location);

      await chatService.createChat({
        roomNum,
        sendUserId,
        receiveUserId,
        chatText: newLocation,
        checkChat,
        chatType,
        sample,
      });
      res.sendStatus(200);
    } else {
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
    }
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
    const chatType = DIRECTORY.IMAGE;
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
