import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';

import { useStoreUser } from './useStoreUser';
import type { SocketState } from '../types/store';
import { useStoreChat } from './useStoreChat';
const baseURL = import.meta.env.VITE_SOCKET_URL;

export const useStoreSocket = create<SocketState>((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const accessToken = useStoreUser.getState().accessToken;
        const existingSocket = get().socket;
        if (existingSocket) return;

        const socket: Socket = io(baseURL, {
            auth: { token: accessToken },
            transports: ['websocket'],
        });
        set({ socket });

        socket.on('connect', () => {
            console.log('Đã kết nối với socket');
        });
        socket.on('online-users', (userIds) => {
            set({ onlineUsers: userIds });
        });
        socket.on('new-messages', ({ message, conversation, unreadCounts }) => {
            useStoreChat.getState().addMessage(message);
            const lastMessage = {
                _id: conversation.lastMessage._id,
                sendBy: { _id: conversation.lastMessage.sendBy, displayName: '', avatarUrl: null },
                createdAt: conversation.lastMessage.createdAt,
                content: conversation.lastMessage.content,
            };
            const updateConversation = {
                ...conversation,
                lastMessage,
                unreadCounts,
            };
            useStoreChat.getState().updateConversation(updateConversation);
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
