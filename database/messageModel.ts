import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from './database';

class Message extends Model {}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('normal', 'edited', 'removed', 'orphan', 'blocked'),
      defaultValue: 'normal',
    },
  },
  {
    sequelize,
    modelName: 'Message',
    timestamps: false,
  }
);

export default Message;
