import { Context } from "koa";
import { Message } from "../../../models";
import { User } from "../../../models";
import { Op } from "sequelize";
import websocketService from "../../../services/websocketService";

export default {
  async getConversations(ctx: Context): Promise<void> {
    try {
      const userId = ctx.state.user.id;
      const sentMessages = await Message.findAll({
        attributes: ["recipientId"],
        where: { senderId: userId },
        group: ["recipientId"],
        raw: true,
      });

      const receivedMessages = await Message.findAll({
        attributes: ["senderId"],
        where: { recipientId: userId },
        group: ["senderId"],
        raw: true,
      });

      const recipientIds = sentMessages.map((m) => m.recipientId);
      const senderIds = receivedMessages.map((m) => m.senderId);
      const uniqueUserIds = [...new Set([...recipientIds, ...senderIds])];

      const users = await User.findAll({
        attributes: ["id", "username", "avatarUrl"],
        where: {
          id: {
            [Op.in]: uniqueUserIds,
          },
        },
      });

      const conversations = await Promise.all(
        users.map(async (user) => {
          const latestMessage = await Message.findOne({
            where: {
              [Op.or]: [
                { senderId: userId, recipientId: user.id },
                { senderId: user.id, recipientId: userId },
              ],
            },
            order: [["created_at", "DESC"]],
          });

          const unreadCount = await Message.count({
            where: {
              senderId: user.id,
              recipientId: userId,
              isRead: false,
            },
          });

          return {
            user: {
              id: user.id,
              username: user.username,
              avatar: user.avatarUrl,
              online: websocketService.isUserOnline(user.id),
            },
            latestMessage: latestMessage
              ? {
                  id: latestMessage.id,
                  content: latestMessage.content,
                  createdAt: latestMessage.get("createdAt"),
                  fromMe: latestMessage.senderId === userId,
                }
              : null,
            unreadCount,
          };
        })
      );

      ctx.body = {
        success: true,
        data: conversations,
      };
    } catch (error) {
      console.error("Error fetching conversations:", error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: "Failed to fetch conversations",
      };
    }
  },

  async getChatHistory(ctx: Context): Promise<void> {
    try {
      const userId = ctx.state.user.id;
      const { otherUserId } = ctx.params;

      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId, recipientId: otherUserId },
            { senderId: otherUserId, recipientId: userId },
          ],
        },
        order: [["created_at", "ASC"]],
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "username", "avatarUrl"],
          },
        ],
      });

      const unreadMessages = messages.filter(
        (m) => !m.isRead && m.recipientId === userId
      );

      if (unreadMessages.length > 0) {
        await Promise.all(
          unreadMessages.map((message) => {
            message.isRead = true;
            return message.save();
          })
        );

        unreadMessages.forEach((message) => {
          websocketService.sendToUser(message.senderId, "messageRead", {
            messageId: message.id,
          });
        });
      }

      const isOnline = websocketService.isUserOnline(otherUserId);

      ctx.body = {
        success: true,
        data: {
          messages: messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.get("createdAt"),
            isRead: msg.isRead,
            sender: msg.senderId,
            isFromMe: msg.senderId === userId,
          })),
          isOnline,
        },
      };
    } catch (error) {
      console.error("Error fetching chat history:", error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: "Failed to fetch chat history",
      };
    }
  },

  async createMessage(ctx: Context): Promise<void> {
    try {
      const userId = ctx.state.user.id;
      const { recipientId, content } = ctx.request.body as {
        recipientId: string;
        content: string;
      };

      if (!recipientId || !content) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          error: "Missing required fields",
        };
        return;
      }

      const message = await Message.create({
        senderId: userId,
        recipientId,
        content,
        isRead: false,
      });

      const messageData = {
        id: message.id,
        senderId: userId,
        recipientId,
        content,
        isRead: false,
        createdAt: message.get("createdAt"),
      };

      const isDelivered = websocketService.sendToUser(
        recipientId,
        "message",
        messageData
      );

      ctx.body = {
        success: true,
        data: {
          ...messageData,
          delivered: isDelivered,
        },
      };
    } catch (error) {
      console.error("Error creating message:", error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: "Failed to create message",
      };
    }
  },

  // rest alternative
  async markMessageAsRead(ctx: Context): Promise<void> {
    try {
      const userId = ctx.state.user.id;
      const { messageId } = ctx.params;

      const message = await Message.findOne({
        where: {
          id: messageId,
          recipientId: userId,
          isRead: false,
        },
      });

      if (!message) {
        ctx.status = 404;
        ctx.body = {
          success: false,
          error: "Message not found or already read",
        };
        return;
      }

      message.isRead = true;
      await message.save();

      websocketService.sendToUser(message.senderId, "messageRead", {
        messageId,
      });

      ctx.body = {
        success: true,
        data: { messageId },
      };
    } catch (error) {
      console.error("Error marking message as read:", error);
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: "Failed to mark message as read",
      };
    }
  },
};
