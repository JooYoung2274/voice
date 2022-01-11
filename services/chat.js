const { ChatRoom, ChatParticipant } = require("../models");

const createChatRoom = async ({ userId, qUserId }) => {
  const findedChatRoom = await ChatRoom.findOne({ where: { userId, qUserId } });
  if (!findedChatRoom) {
    await ChatRoom.create({
      userId,
      qUserId,
    });
  }
  return;
};

const createChat = async ({ userId, qUserId, sendUserId, chatText }) => {
  const findedChatRoom = await ChatRoom.findOne({
    attributes: ["chatRoomId"],
    where: { userId, qUserId },
  });
  console.log(findedChatRoom.chatRoomId);

  const chatRoomId = findedChatRoom.chatRoomId;
  await ChatParticipant.create({
    sendUserId,
    chatRoomId,
    chatText,
  });
  return;
};

module.exports = { createChatRoom, createChat };
