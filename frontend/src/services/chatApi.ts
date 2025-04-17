import { api } from "./api";
import { MessageAttributes, Conversation } from "../contexts/chatContext";

const chatApi = {
  // Get all conversations for the current user
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await api.get("/conversations");
      return response.data;
    } catch (error) {
      console.error("Error getting conversations:", error);
      throw error;
    }
  },

  // Get chat history with a specific user
  async getChatHistory(
    userId: string
  ): Promise<{ messages: MessageAttributes[]; isOnline: boolean }> {
    try {
      console.log("GET CHAT HISTORY", userId);
      const response = await api.get(`/messages/${userId}`);
      return {
        messages: response.data.messages || [],
        isOnline: response.data.isOnline || false,
      };
    } catch (error) {
      console.error("Error getting chat history:", error);
      throw error;
    }
  },

  // Create a new message
  async sendMessage(
    recipientId: string,
    content: string
  ): Promise<MessageAttributes> {
    try {
      const response = await api.post("/messages", {
        recipientId,
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Mark a single message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await api.post(`/messages/${messageId}/read`);
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  },

  // Mark multiple messages as read in a batch
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    try {
      await api.post("/messages/read", {
        messageIds,
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  },
};

export default chatApi;
