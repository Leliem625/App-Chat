import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState } from '../types/store';
import { chatService } from '@/services/chatService';
import { useStoreUser } from './useStoreUser';

export const useStoreChat = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,

            messageLoading: false,
            loading: false,

            setActiveConversation: (id) => set({ activeConversationId: id }),
            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    // convoLoading: false,
                    messageLoading: false,
                    loading: false,
                });
            },
            fetchConversations: async () => {
                try {
                    set({ loading: true });
                    const { conversations } = await chatService.fetchConversations();
                    set({ conversations, loading: false });
                } catch (error) {
                    console.error('Lỗi xảy ra khi lấy cuộc trò chuyện', error);
                    set({ loading: false });
                }
            },
            fetchMessages: async (conversationId) => {
                const { activeConversationId, messages } = get();
                const { user } = useStoreUser.getState();

                const convoId = conversationId ?? activeConversationId;

                if (!convoId) return;

                const current = messages?.[convoId];
                const nextCursor = current?.nextCursor === undefined ? '' : current?.nextCursor;

                if (nextCursor === null) return;
                set({ messageLoading: true });
                try {
                    const { messages: fetched, cursor } = await chatService.fetchMessages(convoId, nextCursor);
                    const processed = fetched.map((m) => ({
                        ...m,
                        isOwn: m.senderId === user?._id,
                    }));

                    set((state) => {
                        const prev = state.messages[convoId]?.items ?? [];
                        const merged = prev.length > 0 ? [...processed, ...prev] : processed;

                        return {
                            messages: {
                                ...state.messages,
                                [convoId]: {
                                    items: merged,
                                    hasMore: !!cursor,
                                    nextCursor: cursor ?? null,
                                },
                            },
                        };
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    set({ messageLoading: false });
                }
            },
            sendMessageDirect: async (recipientId, content, imgUrl) => {
                try {
                    const { activeConversationId } = get();
                    console.log(activeConversationId);
                    
                    await chatService.sendMessageDirect(
                        recipientId,
                        content,
                        activeConversationId || undefined,
                        imgUrl!
                        
                    );
                    set((state) => ({
                        conversations: state.conversations.map((c) =>
                            c._id === activeConversationId ? { ...c, seenBy: [] } : c,
                        ),
                    }));
                } catch (error) {
                    console.error('Lỗi khi gửi tin nhắn!', error);
                }
            },
            sendMessageGroup: async (conversationId, content, imgUrl) => {
                try {
                    await chatService.sendMessageGroup(conversationId, content, imgUrl!);
                    set((state) => ({
                        conversations: state.conversations.map((c) =>
                            c._id === get().activeConversationId ? { ...c, seenBy: [] } : c,
                        ),
                    }));
                } catch (error) {
                    console.error('Loi khi gui tin nhan', error);
                }
            },
        }),
        {
            name: 'chat-storage',
            partialize: (state) => ({ conversations: state.conversations }),
        },
    ),
);
