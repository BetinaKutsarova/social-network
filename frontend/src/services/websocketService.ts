import socketIOClient from "socket.io-client";

export interface MessageAttributes {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  isFromMe: boolean;
}

type MessageHandler = (message: MessageAttributes) => void;
type StatusHandler = (status: { userId: string; online: boolean }) => void;
type OnlineUsersHandler = (userIds: string[]) => void;

class SocketService {
  private socket: ReturnType<typeof socketIOClient> | null = null;
  private messageHandlers: MessageHandler[] = [];
  private messageReadHandlers: ((messageId: string) => void)[] = [];
  private statusHandlers: StatusHandler[] = [];
  private onlineUsersHandlers: OnlineUsersHandler[] = [];
  private connected = false;
  private reconnecting = false;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(serverUrl: string, token: string): Promise<boolean> {
    return new Promise((resolve) => {
      console.log("IN PROMISE");
      this.socket = socketIOClient(`${serverUrl}`, {
        query: { token },
      });

      // this.socket = socketIOClient(serverUrl, {
      //   auth: {
      //     token
      //   },
      //   transports: ['websocket']
      // });

      this.socket.on("connect", () => {
        this.connected = true;
        this.reconnecting = false;

        this.socket?.emit("getOnlineUsers");
        resolve(true);
      });

      this.socket.on("connect_error", (error: unknown) => {
        console.error("Connection error:", error);
        resolve(false);
      });

      this.socket.on("message", (message: MessageAttributes) => {
        this.messageHandlers.forEach((handler) => handler(message));
      });

      this.socket.on("messageSent", (message: MessageAttributes) => {
        this.messageHandlers.forEach((handler) =>
          handler({
            ...message,
            isFromMe: true,
          })
        );
      });

      this.socket.on("messageRead", (data: { messageId: string }) => {
        this.messageReadHandlers.forEach((handler) => handler(data.messageId));
      });

      this.socket.on(
        "userStatus",
        (data: { userId: string; online: boolean }) => {
          this.statusHandlers.forEach((handler) => handler(data));
        }
      );

      this.socket.on("onlineUsers", (userIds: string[]) => {
        console.log("ONLINE USERS", userIds);
        this.onlineUsersHandlers.forEach((handler) => handler(userIds));
      });

      this.socket.on("error", (error: unknown) => {
        console.error("Socket error:", error);
        resolve(false);
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
        this.connected = false;
        resolve(false);
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.reconnecting = false;
      this.socket.disconnect();
      this.connected = false;
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public sendMessage(data: { recipientId: string; content: string }): void {
    console.log("SEND MESSAGE WEBSOCKET SERVICE ");
    if (!this.socket || !this.connected) {
      throw new Error("Socket not connected");
    }

    this.socket.emit("sendMessage", data);
  }

  public markAsRead(messageId: string): void {
    if (!this.socket || !this.connected) {
      throw new Error("Socket not connected");
    }

    this.socket.emit("markAsRead", { messageId });
  }

  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  public onMessageRead(handler: (messageId: string) => void): () => void {
    this.messageReadHandlers.push(handler);
    return () => {
      this.messageReadHandlers = this.messageReadHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  public onUserStatus(handler: StatusHandler): () => void {
    this.statusHandlers.push(handler);
    return () => {
      this.statusHandlers = this.statusHandlers.filter((h) => h !== handler);
    };
  }

  public onOnlineUsers(handler: OnlineUsersHandler): () => void {
    this.onlineUsersHandlers.push(handler);
    return () => {
      this.onlineUsersHandlers = this.onlineUsersHandlers.filter(
        (h) => h !== handler
      );
    };
  }
}

export default SocketService.getInstance();
