import { useStoreChat } from '@/store/useStoreChat';
import React from 'react';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import ChatSkeleton from './ChatSkeleton';
import { SidebarInset } from '../ui/sidebar';
import ChatWindowHeader from './ChatWindowHeader';
import ChatWindowBody from './ChatWindowBody';
import ChatWindowFooter from './ChatWindowFooter';

const ChatWindowLayout = () => {
    const { activeConversationId, messageLoading, conversations } = useStoreChat();
    const selectConversation = conversations.find((p) => p._id === activeConversationId) ?? null;
    if (!selectConversation) return <ChatWelcomeScreen />;
    if (messageLoading) return <ChatSkeleton />;
    return (
        <SidebarInset className="flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md">
            <ChatWindowHeader chat={selectConversation} />
            <div className="flex-1 overflow-y-auto bg-primary-foreground">
                <ChatWindowBody />
            </div>
            <ChatWindowFooter selectConvo={selectConversation} />
        </SidebarInset>
    );
};

export default ChatWindowLayout;
