"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChatParticipant.belongsTo(models.ChatRoom, { foreignKey: "chatRoomId", onDelete: "cascade" });
    }
  }
  ChatParticipant.init(
    {
      ChatParticipantId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      receiveUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sendUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sample: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      chatType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      chatText: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      checkChat: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    },
    {
      sequelize,
      timstamps: true,
      modelName: "ChatParticipant",
    },
  );
  return ChatParticipant;
};
