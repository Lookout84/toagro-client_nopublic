import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { chatApi } from '@/api/chatApi';
import { ChatMessage, Conversation, SendMessageData } from '@/types/chat.types';

interface ChatState {
  conversations: Conversation[];
  currentConversation: {
    userId: number;
    userName: string;
    avatar?: string;
    messages: ChatMessage[];
  } | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Асинхронні дії для чату
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getConversations();
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання розмов');
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await chatApi.getConversation(userId);
      return {
        userId,
        messages: response.data.messages,
        meta: response.data.meta,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання повідомлень');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: SendMessageData, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(data);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка відправки повідомлення');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (userId: number, { rejectWithValue }) => {
    try {
      await chatApi.markAsRead(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка позначення повідомлень прочитаними');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getUnreadCount();
      return response.data.count;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка отримання кількості непрочитаних повідомлень');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<number>) => {
      const userId = action.payload;
      const conversation = state.conversations.find(c => c.other_user_id === userId);
      
      if (conversation) {
        state.currentConversation = {
          userId: conversation.other_user_id,
          userName: conversation.other_user_name,
          avatar: conversation.other_user_avatar,
          messages: [],
        };
      }
    },
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
    },
    addMessageToCurrentConversation: (state, action: PayloadAction<ChatMessage>) => {
      if (state.currentConversation) {
        state.currentConversation.messages.push(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch conversation
      .addCase(fetchConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const conversation = state.conversations.find(c => c.other_user_id === action.payload.userId);
        
        if (conversation) {
          state.currentConversation = {
            userId: conversation.other_user_id,
            userName: conversation.other_user_name,
            avatar: conversation.other_user_avatar,
            messages: action.payload.messages,
          };
        }
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (state.currentConversation && 
            state.currentConversation.userId === action.payload.receiverId) {
          state.currentConversation.messages.push(action.payload);
        }
        
        // Update conversation list
        const conversationIndex = state.conversations.findIndex(
          c => c.other_user_id === action.payload.receiverId
        );
        
        if (conversationIndex !== -1) {
          // Update existing conversation
          state.conversations[conversationIndex].last_message = action.payload.content;
          state.conversations[conversationIndex].last_message_time = action.payload.createdAt;
        } else {
          // Add new conversation
          if (action.payload.receiver) {
            state.conversations.unshift({
              other_user_id: action.payload.receiverId,
              other_user_name: action.payload.receiver.name,
              other_user_avatar: action.payload.receiver.avatar,
              last_message: action.payload.content,
              last_message_time: action.payload.createdAt,
              unread_count: 0,
            });
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const userId = action.payload;
        
        // Update conversation unread count
        const conversation = state.conversations.find(c => c.other_user_id === userId);
        if (conversation) {
          conversation.unread_count = 0;
        }
        
        // Update total unread count
        state.unreadCount = state.conversations.reduce(
          (total, conv) => total + (conv.unread_count || 0), 0
        );
      })
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const { 
  setCurrentConversation, 
  clearCurrentConversation, 
  addMessageToCurrentConversation, 
  clearError 
} = chatSlice.actions;

export default chatSlice.reducer;