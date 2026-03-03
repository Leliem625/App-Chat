/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ConversationResponse, Message } from '@/types/chat';
import api from '../libs/axios';
interface FetchMessageProps {
    messages: Message[];
    cursor?: string;
}
const pageLimit = 15;
export const chatService = {
    async fetchConversations(): Promise<ConversationResponse> {
        const res = await api.get('/conversations/');
        return res.data;
    },
    async fetchMessages(id: string, cursor?: string): Promise<FetchMessageProps> {
        const res = await api.get(`/conversations/${id}/messages?limit=${pageLimit}&cursor={cursor}`);
        return { messages: res.data.messages, cursor: res.data.nextCursor };
    },
    async sendMessageDirect(recipientId: string, content: string, conversationId?: string, imgUrl?: string) {
        const res = await api.post('/message/send', { recipientId, content, conversationId, imgUrl });
        
        return res.data.message;
    },
    async sendMessageGroup(conversationId: string, content: string, imgUrl?: string) {
        const res = await api.post('/message/sendgroup', { conversationId, content, imgUrl });
        return res.data.message;
    },
};
