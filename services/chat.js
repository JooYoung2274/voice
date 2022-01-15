const { ChatRoom, ChatParticipant, User } = require("../models");

const { Op } = require("sequelize");
const { or } = Op;
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

const getRoomId = async ({ userId, qUserId, roomNum, page, chat }) => {
  try {
    let start = 0;
    let pageSize = chat;
    if (page <= 0 || !page) {
      page = 1;
    } else {
      start = (page - 1) * pageSize;
    }
    let end = page * pageSize;
    const profile = await User.findAll({
      where: {
        [or]: [{ userId }, { userId: qUserId }],
      },
    });
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (getChatRoom) {
      const results = await ChatParticipant.findAll({
        // attributes: ["sendUserId", "chatText"],
        where: { chatRoomId: getChatRoom.chatRoomId },
        order: [["chatParticipantId", "DESC"]],
      });
      const getChat = results.slice(start, end);
      return { getChat, profile };
    }
    return;
  } catch (error) {
    throw error;
  }
};

module.exports = { createChatRoom, createChat, getRoomId };
