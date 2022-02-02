const { ChatRoom, ChatParticipant, User } = require("../models");

const { Op } = require("sequelize");
const { or, and } = Op;
const { customizedError } = require("../utils/error");

const { MESSAGE } = require("../config/constants");

// 채팅 저장 기본 폼
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

// chatRoom DB에 생성.
const createChatRoom = async ({ userId, qUserId, roomNum }) => {
  try {
    if (!userId || !qUserId || !roomNum) {
      throw customizedError(MESSAGE.WRONG_REQ, 400);
    }
    // 기존 채팅 방이 없으면 생성 후 리턴
    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (!getChatRoom) {
      await ChatRoom.create({
        userId,
        userId2: qUserId,
        roomNum,
      });
      return;
    }
    // 기존 채팅방에 있으면 해당 채팅방의 checkChat 전부 true로 업데이트 후 리턴
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

// 채팅 내용 저장 api
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
      throw customizedError(MESSAGE.ISNOT_CHATROOM, 400);
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

// 채팅방 입장 시 채팅 내용 불러오기 api
// 페이지 별로 프론트에서 정해진 갯수만큼 리턴하게 구성
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
      throw customizedError(MESSAGE.NOT_USER, 400);
    }
    ``;

    const getChatRoom = await ChatRoom.findOne({ where: { roomNum } });
    if (getChatRoom) {
      const results = await ChatParticipant.findAll({
        where: { chatRoomId: getChatRoom.chatRoomId },
        ...chatBasicForm,
      });

      // 채팅을 누가 읽느냐에 따라서 리턴값이 달라짐.
      // 프론트 쪽에서 원하는 형식에 맞게 구성해서 리턴(프론트요청)
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

// 채팅 리스트 페이지 들어갔을 때 리스트 불러오기 api
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
      if (chatList) {
        result.push(chatList);
      }
    }

    // 해당 채팅방의 마지막 내용과 사용자가 누구랑 채팅하는지에 대한 정보가 있어야함.
    // 프론트 요청으로 프론트에서 원하는 형식으로 변경해서 리턴
    for (let i = 0; i < result.length; i++) {
      if (result[i].sendUserId === Number(userId)) {
        const qUserId2 = await User.findOne({
          attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
          where: { userId: result[i].receiveUserId },
        });
        result[i].dataValues.userId = userId;
        result[i].dataValues.qUserId = qUserId2;
      } else if (result[i].receiveUserId === Number(userId)) {
        const qUserId1 = await User.findOne({
          attributes: ["nickname", "contact", "profileImage", "introduce", "userId"],
          where: { userId: result[i].sendUserId },
        });
        result[i].dataValues.userId = userId;
        result[i].dataValues.qUserId = qUserId1;
      }
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// 채팅을 읽었는지 확인하는 api
const checkChat = async ({ userId }) => {
  const xx = Number(userId);
  const chatRoom = await ChatRoom.findAll({
    attributes: ["chatRoomId"],
    where: {
      [or]: [{ userId: xx }, { userId2: xx }],
    },
  });

  let roomCheck = true;
  if (!chatRoom) {
    return roomCheck;
  }

  for (let i = 0; i < chatRoom.length; i++) {
    const chatList = await ChatParticipant.findOne({
      where: { chatRoomId: chatRoom[i].chatRoomId },
      ...chatBasicForm,
    });

    if (chatList !== null) {
      if (chatList.checkChat === false && chatList.sendUserId !== xx) {
        roomCheck = false;
        return roomCheck;
      }
    } else {
      continue;
    }
  }
  return roomCheck;
};

// 채팅내용 불러오기 api
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
