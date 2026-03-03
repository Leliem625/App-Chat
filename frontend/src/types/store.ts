import type { Conversation, Message } from './chat.ts';
import type { User } from './user.ts';
import type { Socket } from 'socket.io-client';
export interface AuthUser {
    accessToken: string | null;
    user: User | null;
    loading: boolean;
    setAccessToken: (accessToken: string) => void;
    clearState: () => void;
    signUp: (username: string, password: string, email: string, firstName: string, lastName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refreshToken: () => Promise<void>;
}

export interface ChatState {
    conversations: Conversation[];
    messages: Record<
        string,
        {
            items: Message[];
            hasMore: boolean;
            nextCursor?: string | null;
        }
    >;
    activeConversationId: string | null;
    loading: boolean;
    messageLoading: boolean;
    reset: () => void;
    setActiveConversation: (id: string | null) => void;
    fetchConversations: () => Promise<void>;
    fetchMessages: (conversationId?: string) => Promise<void>;
    sendMessageDirect: (recipientId: string, content: string, imgUrl?: string) => Promise<void>;
    sendMessageGroup: (conversationId: string, content: string, imgUrl?: string) => Promise<void>;
    addMessage: (message: Message) => Promise<void>;
}
export interface SocketState {
    socket: Socket | null;
    onlineUsers: string[];
    connectSocket: () => void;
    disconnectSocket: () => void;
}
