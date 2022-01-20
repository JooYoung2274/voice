const { ChatRoom, ChatParticipant, User } = require("../models");

const { Op } = require("sequelize");
const { or, and } = Op;
const { customizedError } = require("../utils/error");
const { S3_HOST } = process.env;
const { randomFilename } = require("../middleware/uploader");

const { convertAndSaveS3 } = require("../utils/converter");

const chatBasicForm = {
  attributes: [
    "sendUserId",
    "receiveUserId",
    "chatType",
    "chatText",
    "checkChat",
    "createdAt",
    "sample",
  ],
  order: [["chatParticipantId", "DESC"]],
};

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
  sample,
}) => {
  try {
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (!getChatRoom) {
      throw customizedError("삭제된 채팅방입니다", 400);
    }

    await ChatParticipant.create({
      sendUserId,
      receiveUserId,
      sample,
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

    if (!profile1 || !profile2) {
      throw customizedError("가입하지 않은 사용자입니다.", 400);
    }
    ``;

    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (getChatRoom) {
      const results = await ChatParticipant.findAll({
        where: { chatRoomId: getChatRoom.chatRoomId },
        ...chatBasicForm,
      });

      const getChat = results.slice(start, end);
      getChat.reverse();
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
  try {
    const chatRoom = await ChatRoom.findAll({
      attributes: ["chatRoomId", "userId", "userId2"],
      where: {
        [or]: [{ userId }, { userId2: userId }],
      },
    });

    if (!chatRoom) {
      return;
    }

    let result = [];
    for (let i = 0; i < chatRoom.length; i++) {
      const chatList = await ChatParticipant.findOne({
        where: { chatRoomId: chatRoom[i].chatRoomId },
        ...chatBasicForm,
      });
      result.push(chatList);

      if (!chatList) {
        result.splice(i, 1);
      }

      // console.log(result);
      if (chatList.sendUserId === Number(userId)) {
        const qUserId2 = await User.findOne({
          attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
          where: { userId: chatList.receiveUserId },
        });
        result[i].dataValues.userId = userId;
        result[i].dataValues.qUserId = qUserId2;
      } else if (chatList.receiveUserId === Number(userId)) {
        console.log("DSFASDFSDAFASDF");
        const qUserId1 = await User.findOne({
          attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
          where: { userId: chatList.sendUserId },
        });
        console.log(result[i]);
        result[i].dataValues.userId = userId;
        result[i].dataValues.qUserId = qUserId1;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
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
      where: { chatRoomId: chatRoom[i].chatRoomId },
      ...chatBasicForm,
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

const getChatByIds = async ({ receiveUserId, sendUserId, chatType }) => {
  const getchat = await ChatParticipant.findOne({
    where: { receiveUserId, sendUserId },
    ...chatBasicForm,
  });
  const user = await User.findOne({
    attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
    where: { userId: sendUserId },
  });
  getchat.sendUserId = user;
  return getchat;
};

module.exports = { createChatRoom, createChat, getRoomId, getList, checkChat, getChatByIds };
