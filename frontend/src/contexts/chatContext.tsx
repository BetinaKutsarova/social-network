import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAtom } from "jotai";
import { socketAtom, userAtom } from "../state/atoms";
import { api } from "../services/api";
import websocketService, {
  MessageAttributes as SocketMessage,
} from "../services/websocketService";

export interface MessageAttributes {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  isFromMe?: boolean;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  online?: boolean;
  token: string;
}

export interface LatestMessage {
  id: string;
  content: string;
  createdAt: string;
  fromMe: boolean;
}

export interface Conversation {
  id?: string;
  user: User;
  latestMessage?: LatestMessage;
  unreadCount: number;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: string | null;
  messages: MessageAttributes[];
  activeUserOnline: boolean;
  isLoading: boolean;
  error: string | null;
  setActiveConversation: (userId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
  refreshMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user] = useAtom(userAtom);
  const [socketConnection] = useAtom(socketAtom);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversationState] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<MessageAttributes[]>([]);
  const [activeUserOnline, setActiveUserOnline] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!socketConnection || !user) return;

    const messageHandler = (socketMsg: SocketMessage) => {
      const message: MessageAttributes = {
        id: socketMsg.id,
        sender: socketMsg.senderId,
        recipient: socketMsg.recipientId,
        content: socketMsg.content,
        isRead: socketMsg.isRead,
        createdAt: new Date().toISOString(),
        isFromMe: socketMsg.isFromMe || false,
      };

      if (
        activeConversation === socketMsg.senderId ||
        (socketMsg.isFromMe && activeConversation === socketMsg.recipientId)
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          return exists ? prev : [...prev, message];
        });

        if (activeConversation === socketMsg.senderId && !socketMsg.isFromMe) {
          websocketService.markAsRead(message.id);
        }
      }

      updateConversationWithNewMessage(message);
    };

    const messageReadHandler = (messageId: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    };

    const userStatusHandler = ({
      userId,
      online,
    }: {
      userId: string;
      online: boolean;
    }) => {
      console.log(
        `User status update: ${userId} is now ${online ? "online" : "offline"}`
      );

      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === userId
            ? { ...conv, user: { ...conv.user, online } }
            : conv
        )
      );

      if (activeConversation === userId) {
        setActiveUserOnline(online);
      }
    };

    const onlineUsersHandler = (userIds: string[]) => {
      console.log("Online users update:", userIds);
      setConversations((prev) =>
        prev.map((conv) => ({
          ...conv,
          user: {
            ...conv.user,
            online: userIds ? userIds?.includes(conv.user.id) : false,
          },
        }))
      );

      if (activeConversation) {
        setActiveUserOnline(userIds.includes(activeConversation));
      }
    };

    const messageUnsubscribe = websocketService.onMessage(messageHandler);
    const messageReadUnsubscribe =
      websocketService.onMessageRead(messageReadHandler);
    const statusUnsubscribe = websocketService.onUserStatus(userStatusHandler);
    const onlineUsersUnsubscribe =
      websocketService.onOnlineUsers(onlineUsersHandler);

    return () => {
      messageUnsubscribe();
      messageReadUnsubscribe();
      statusUnsubscribe();
      onlineUsersUnsubscribe();
    };
  }, [user, activeConversation]);

  useEffect(() => {
    if (activeConversation && user) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation, user]);

  const fetchConversations = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const response = await api.get("/conversations");
      console.log("FETCH CONVERSATIONS RESPONSE", response.data);
      setConversations(response.data.data);
      if (showLoading) setIsLoading(false);
    } catch (err) {
      console.error("Failed to load conversations:", err);
      setError("Failed to load conversations");
      if (showLoading) setIsLoading(false);
    }
  };

  const fetchMessages = async (userId: string, showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      const messagesResponse = await api.get(`/messages/${userId}`);

      const messagesArray: MessageAttributes[] =
        messagesResponse.data.data.messages || [];
      const processedMessages = messagesArray.map((msg: MessageAttributes) => ({
        ...msg,
        isFromMe: msg.sender === user?.id,
      }));

      setMessages(processedMessages);
      console.log(
        "before setting the active user online he is:",
        messagesResponse.data.data.isOnline
      );
      setActiveUserOnline(messagesResponse.data.data.isOnline || false);

      if (processedMessages.length > 0 && socketConnection) {
        const unreadMessages: MessageAttributes[] = processedMessages.filter(
          (msg: MessageAttributes) => !msg.isRead && msg.sender !== user?.id
        );

        if (unreadMessages.length > 0) {
          unreadMessages.forEach((msg) => {
            websocketService.markAsRead(msg.id);
          });

          setMessages((prevMessages) =>
            prevMessages.map((msg: MessageAttributes) =>
              unreadMessages.some(
                (unread: MessageAttributes) => unread.id === msg.id
              )
                ? { ...msg, isRead: true }
                : msg
            )
          );
        }
      }

      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.user.id === userId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      if (showLoading) setIsLoading(false);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setError("Failed to load messages");
      if (showLoading) setIsLoading(false);
    }
  };

  const setActiveConversation = (userId: string) => {
    setActiveConversationState(userId);
    fetchMessages(userId);
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!activeConversation || !user) {
      throw new Error("No active conversation");
    }

    if (!content.trim()) {
      throw new Error("Message content cannot be empty");
    }

    try {
      if (!socketConnection) {
        throw new Error("Not connected to chat server");
      }

      const tempId = `temp-${Date.now()}`;
      const tempMessage = {
        id: tempId,
        content,
        createdAt: new Date().toISOString(),
        sender: user.id,
        recipient: activeConversation,
        isRead: false,
        isFromMe: true,
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      websocketService.sendMessage({
        recipientId: activeConversation,
        content,
      });

      updateConversationWithNewMessage(tempMessage);

    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");

      setMessages((prevMessages) =>
        prevMessages.filter(
          (msg: MessageAttributes) => !msg.id.startsWith("temp-")
        )
      );
    }
  };

  const markAsRead = async (messageId: string): Promise<void> => {
    try {
      if (socketConnection) {
        websocketService.markAsRead(messageId);
      } else {
        await api.post(`/messages/${messageId}/read`);
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg: MessageAttributes) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  };

  const updateConversationWithNewMessage = (message: MessageAttributes) => {
    const isFromMe = message.sender === user?.id;
    const otherUserId = isFromMe ? message.recipient : message.sender;

    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.user.id === otherUserId);

      if (existingIndex === -1) {
        fetchUserDetailsAndAddConversation(otherUserId, message);
        return prev;
      }

      const updated = [...prev];
      const conversation = { ...updated[existingIndex] };

      conversation.latestMessage = {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        fromMe: isFromMe,
      };

      if (!isFromMe && activeConversation !== message.sender) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }

      updated.splice(existingIndex, 1);
      updated.unshift(conversation);

      return updated;
    });
  };

  const fetchUserDetailsAndAddConversation = async (
    userId: string,
    message: MessageAttributes
  ) => {
    try {
      const response = await api.get(`/users/${userId}`);
      const userData = response.data;
      const isFromMe = message.sender === user?.id;

      setConversations((current) => [
        {
          user: {
            id: userData.id,
            username: userData.username,
            avatarUrl: userData.avatarUrl,
            online: false,
            token: userData.token,
          },
          latestMessage: {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            fromMe: isFromMe,
          },
          unreadCount: isFromMe ? 0 : 1,
        },
        ...current,
      ]);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  };

  const refreshConversations = async (): Promise<void> => {
    return fetchConversations();
  };

  const refreshMessages = async (): Promise<void> => {
    if (!activeConversation) return;
    return fetchMessages(activeConversation);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,
        activeUserOnline,
        isLoading,
        error,
        setActiveConversation,
        sendMessage,
        markAsRead,
        refreshConversations,
        refreshMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return { ...context, conversations: context.conversations };
};
