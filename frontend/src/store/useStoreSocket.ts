import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';

import { useStoreUser } from './useStoreUser';
import type { SocketState } from '../types/store';
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
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
          
        }
    },
}));
