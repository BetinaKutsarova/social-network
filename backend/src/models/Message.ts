import { Model, DataTypes } from 'sequelize';
import sequelize from '../core/db';
import User from './User';

export interface MessageAttributes {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
}

export type MessageCreationAttributes = Omit<MessageAttributes, 'id'>

class Message extends Model<MessageAttributes, MessageCreationAttributes> {
  declare id: string;
  declare senderId: string;
  declare recipientId: string;
  declare content: string;
  declare isRead: boolean;
}

Message.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    recipientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  },
  {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
    timestamps: true,
    updatedAt: false,
    underscored: true,
    validate: {
      noSelfMessage() {
        if (this.senderId === this.recipientId) {
          throw new Error('A user cannot send messages to themselves');
        }
      }
    }
  }
);

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'recipientId', as: 'receivedMessages' });

export default Message;