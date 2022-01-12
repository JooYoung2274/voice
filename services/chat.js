const { ChatRoom, ChatParticipant } = require("../models");

const createChatRoom = async ({ userId, qUserId }) => {
  console.log(userId, qUserId);
  const getChatRoom = await ChatRoom.findOne({ where: { userId, qUserId } });
  if (!getChatRoom) {
    await ChatRoom.create({
      userId,
      qUserId,
    });
  }
  return;
};

const createChat = async ({ userId, qUserId, sendUserId, chatText }) => {
  const getChatRoom = await ChatRoom.findOne({
    attributes: ["chatRoomId"],
    where: { userId, qUserId },
  });

  const chatRoomId = getChatRoom.chatRoomId;
  await ChatParticipant.create({
    sendUserId,
    chatRoomId,
    chatText,
  });
  return;
};

const getRoomId = async ({ userId, qUserId }) => {
  const getChatRoom = await ChatRoom.findOne({
    attributes: ["chatRoomId"],
    where: { userId, qUserId },
  });
  if (getChatRoom) {
    const getChat = await ChatParticipant.findAll({
      attributes: ["sendUserId", "chatText"],
      where: { chatRoomId: getChatRoom.chatRoomId },
    });
    return getChat;
  }
  return;
};

module.exports = { createChatRoom, createChat, getRoomId };
