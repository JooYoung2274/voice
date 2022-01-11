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
      ChatRoom.hasMany(models.ChatParticipant, { foreignKey: "chatRoomId", onDelete: "cascade" });
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
      qUserId: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
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
