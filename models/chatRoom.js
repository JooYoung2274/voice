"use strict";
const Sequelize = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ChatRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChatRoom.hasMany(models.ChatParticipant, { foreignKey: "chatRoomId" });
      ChatRoom.belongsTo(models.User, { foreignKey: "userId", onDelete: "cascade" });
    }
  }
  ChatRoom.init(
    {
      chatRoomId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      roomNum: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      timstamps: true,
      modelName: "ChatRoom",
    },
  );
  return ChatRoom;
};
