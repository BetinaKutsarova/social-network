import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import Message from "../models/Message";

class WebSocketService {
  private io: Server | null = null;
  private static instance: WebSocketService;
  private userSocketMap: Map<string, string> = new Map(); // userId -> socketId
  private socketUserMap: Map<string, string> = new Map(); // socketId -> userId

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(server: http.Server, jwtSecret: string): void {
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.use((socket, next) => {
      // const token = socket.handshake.auth?.token;

      const token = socket.handshake.query?.token; // just for now 
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      console.log("Query token:", token);

      if (!token || typeof token !== "string") {
        return next(new Error("Authentication error: No token provided"));
      }

      try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        socket.data.userId = decoded.userId;
        next();
      } catch (error) {
        console.log("SOMETHING FAILED MISSERABLY", error);
        return next(new Error("Authentication error: Invalid token"));
      }
    });

    this.io.on("connection", (socket) => {
      console.log("SOCKET CONNECTION", socket.data);

      const userId = socket.data.userId;
      console.log(`New client connected: ${socket.id} (userId: ${userId})`);

      this.userSocketMap.set(userId, socket.id);
      this.socketUserMap.set(socket.id, userId);

      console.log("userSocketMap", this.userSocketMap);
      this.emitOnlineUsers();

      this.sendUnreadMessages(userId);

      socket.on("getOnlineUsers", () => {
        const onlineUserIds = Array.from(this.userSocketMap.keys());
        socket.emit("onlineUsers", onlineUserIds);
      });

      socket.on(
        "sendMessage",
        async (data: { recipientId: string; content: string }) => {
          console.log("Userid", userId);
          try {
            console.log("SEND MESSAGE", {
              userId,
              recipientId: data.recipientId,
              content: data.content,
            });
            const message = await Message.create({
              senderId: userId,
              recipientId: data.recipientId,
              content: data.content,
              isRead: false,
            });
            console.log("sending created message", message);

            const messageData = {
              id: message.id,
              senderId: userId,
              recipientId: data.recipientId,
              content: data.content,
              isRead: false,
              createdAt: message.get("createdAt"),
            };

            // socket.emit("messageSent", messageData);

            const recipientSocketId = this.userSocketMap.get(data.recipientId);
            if (recipientSocketId && this.io) {
              this.io.to(recipientSocketId).emit("message", messageData);
            }
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      socket.on("markAsRead", async (data: { messageId: string }) => {
        try {
          const message = await Message.findOne({
            where: {
              id: data.messageId,
              recipientId: userId,
            },
          });

          if (message) {
            message.isRead = true;
            await message.save();

            const senderSocketId = this.userSocketMap.get(message.senderId);
            if (senderSocketId && this.io) {
              this.io
                .to(senderSocketId)
                .emit("messageRead", { messageId: data.messageId });
            }
          }
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      });

      socket.on("disconnect", () => {
        const disconnectedUserId = this.socketUserMap.get(socket.id);
        if (disconnectedUserId) {
          this.userSocketMap.delete(disconnectedUserId);
          this.socketUserMap.delete(socket.id);

          this.emitOnlineUsers();

          socket.broadcast.emit("userStatus", {
            userId: disconnectedUserId,
            online: false,
          });
        }
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private async sendUnreadMessages(userId: string): Promise<void> {
    try {
      const unreadMessages = await Message.findAll({
        where: {
          recipientId: userId,
          isRead: false,
        },
        order: [["created_at", "ASC"]],
      });

      const socketId = this.userSocketMap.get(userId);
      if (socketId && this.io && unreadMessages.length > 0) {
        unreadMessages.forEach((message) => {
          this.io?.to(socketId).emit("message", {
            id: message.id,
            senderId: message.senderId,
            recipientId: message.recipientId,
            content: message.content,
            isRead: false,
            createdAt: message.get("createdAt"),
          });
        });
      }
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  }

  public broadcastMessage(eventName: string, data: any): void {
    if (this.io) {
      this.io.emit(eventName, data);
    }
  }
  // emit message/event 'online_users' with userSocketMap keys -> userSocketMap

  public emitOnlineUsers() {
    console.log("user socket map keys", this.userSocketMap.keys());
    this.io?.emit("onlineUsers", Array.from(this.userSocketMap.keys()));
  }

  public sendToUser(userId: string, eventName: string, data: any): boolean {
    const socketId = this.userSocketMap.get(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit(eventName, data);
      return true;
    }
    return false;
  }

  public isUserOnline(userId: string): boolean {
    return this.userSocketMap.has(userId);
  }

  public getOnlineUsers(): string[] {
    return Array.from(this.userSocketMap.keys());
  }
}

export default WebSocketService.getInstance();
