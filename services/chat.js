const { ChatRoom, ChatParticipant, User } = require("../models");

const { Op } = require("sequelize");
const { or, and } = Op;
const { customizedError } = require("../utils/error");

const createChatRoom = async ({ userId, qUserId, roomNum }) => {
  try {
    if (!userId || !qUserId || !roomNum) {
      throw customizedError("잘못된 요청입니다", 400);
    }
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (!getChatRoom) {
      await ChatRoom.create({
        userId,
        userId2: qUserId,
        roomNum,
      });
      return;
    }
    await ChatParticipant.update(
      { checkChat: true },
      {
        where: {
          [and]: [{ chatRoomId: getChatRoom.chatRoomId }, { sendUserId: qUserId }],
        },
      },
    );
    return;
  } catch (error) {
    throw error;
  }
};

const createChat = async ({
  roomNum,
  sendUserId,
  receiveUserId,
  chatText,
  checkChat,
  chatType,
}) => {
  try {
    console.log(checkChat);
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (!getChatRoom) {
      throw customizedError("삭제된 채팅방입니다", 400);
    }
    await ChatParticipant.create({
      sendUserId,
      receiveUserId,
      roomNum,
      chatType,
      chatText,
      checkChat,
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
    const profile1 = await User.findOne({
      attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
      where: { userId },
    });
    const profile2 = await User.findOne({
      attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
      where: { userId: qUserId },
    });

    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (getChatRoom) {
      const results = await ChatParticipant.findAll({
        attributes: ["sendUserId", "chatType", "chatText", "createdAt"],
        where: { chatRoomId: getChatRoom.chatRoomId },
        order: [["chatParticipantId", "DESC"]],
      });

      const getChat = results.slice(start, end);
      getChat.reverse();
      console.log(getChat);
      for (let i = 0; i < getChat.length; i++) {
        if (profile1.userId === getChat[i].sendUserId) {
          getChat[i].sendUserId = profile1;
          getChat[i].dataValues.receiveUserId = profile2.userId;
        } else if (profile2.userId === getChat[i].sendUserId) {
          getChat[i].sendUserId = profile2;
          getChat[i].dataValues.receiveUserId = profile1.userId;
        }
      }
      return getChat;
    }
    return;
  } catch (error) {
    throw error;
  }
};

const getList = async ({ userId }) => {
  const chatRoom = await ChatRoom.findAll({
    attributes: ["chatRoomId", "userId", "userId2"],
    where: {
      [or]: [{ userId }, { userId2: userId }],
    },
  });

  const chatRoom1 = await ChatRoom.findAll({
    attributes: ["chatRoomId", "userId", "userId2"],
    where: {
      [or]: [{ userId }],
    },
  });
  const chatRoom2 = await ChatRoom.findAll({
    attributes: ["chatRoomId", "userId", "userId2"],
    where: {
      [or]: [{ userId2: userId }],
    },
  });

  if (!chatRoom1 || !chatRoom2) {
    return;
  }
  // const qUserId = await User.findAll({
  //   attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
  //   where: {
  //     [or]: [{ userId: chatRoom1.userId2 }, { userId: chatRoom2.userId }],
  //   },
  // });

  let result = [];
  for (let i = 0; i < chatRoom.length; i++) {
    const chatList = await ChatParticipant.findOne({
      attributes: ["sendUserId", "receiveUserId", "chatType", "chatText", "checkChat", "createdAt"],
      where: { chatRoomId: chatRoom[i].chatRoomId },
      order: [["chatParticipantId", "DESC"]],
    });
    if (chatList) {
      result.push(chatList);
      console.log(typeof chatList.sendUserId);
      console.log(typeof chatList.receiveUserId);
      console.log(typeof userId);
      if (chatList.sendUserId === Number(userId)) {
        const qUserId2 = await User.findOne({
          attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
          where: { userId: chatList.receiveUserId },
        });
        result[i].dataValues.userId = userId;
        result[i].dataValues.qUserId = qUserId2;
      } else if (chatList.receiveUserId === Number(userId)) {
        const qUserId1 = await User.findOne({
          attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
          where: { userId: chatList.sendUserId },
        });
        result[i].dataValues.userId = userId;
        result[i].dataValues.qUserId = qUserId1;
      }
    }
  }
  // console.log(result);
  return result;
};

const checkChat = async ({ userId }) => {
  const chatRoom = await ChatRoom.findAll({
    attributes: ["chatRoomId"],
    where: {
      [or]: [{ userId }, { userId2: userId }],
    },
  });

  if (!chatRoom) {
    return;
  }
  let roomCheck = false;
  let newChatCount = 0;
  for (let i = 0; i < chatRoom.length; i++) {
    const chatList = await ChatParticipant.findOne({
      attributes: ["checkChat"],
      where: { chatRoomId: chatRoom[i].chatRoomId },
      order: [["chatParticipantId", "DESC"]],
    });

    if (!chatList.checkChat && chatList.sendUserId !== userId) {
      newChatCount++;
      break;
    }
  }

  if (newChatCount) {
    roomCheck = true;
    return roomCheck;
  }
  return roomCheck;
};

const getChatByIds = async ({ receiveUserId, sendUserId }) => {
  const getchat = await ChatParticipant.findOne({
    where: { receiveUserId, sendUserId, chatType: "audio" },
    order: [["chatParticipantId", "DESC"]],
  });
  return getchat;
};

module.exports = { createChatRoom, createChat, getRoomId, getList, checkChat, getChatByIds };
