const { ChatRoom, ChatParticipant } = require("../models");
const { customizedError } = require("../utils/error");

const createChatRoom = async ({ userId, roomNum }) => {
  const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
  if (!getChatRoom) {
    await ChatRoom.create({
      userId,
      roomNum,
    });
  }
  return;
};

const createChat = async ({ roomNum, sendUserId, chatText }) => {
  try {
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    await ChatParticipant.create({
      sendUserId,
      roomNum,
      chatText,
      chatRoomId: getChatRoom.chatRoomId,
    });
    return;
  } catch (error) {
    throw error;
  }
};

const getRoomId = async ({ roomNum }) => {
  try {
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (getChatRoom) {
      const getChat = await ChatParticipant.findAll({
        attributes: ["sendUserId", "chatText"],
        where: { chatRoomId: getChatRoom.chatRoomId },
      });
      return getChat;
    }
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { createChatRoom, createChat, getRoomId };
