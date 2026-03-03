import { useStoreChat } from '@/store/useStoreChat';
import { useStoreUser } from '@/store/useStoreUser';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import MessageItem from './MessageItem';

const ChatWindowBody = () => {
    const { messages: allMessages, activeConversationId, conversations } = useStoreChat();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user } = useStoreUser();
    if (!activeConversationId) return;
    const messages = allMessages[activeConversationId]?.items ?? [];
    const selectConversation = conversations.find((p) => p._id === activeConversationId);
    const reversedMessages = [...messages].reverse();
    if (!selectConversation) return <ChatWelcomeScreen />;
    if (messages?.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground ">
                Chưa có tin nhắn nào trong cuộc trò chuyện này.
            </div>
        );
    }
    return (
        <div className="p-4 bg-primary-foreground h-full overflow-hidden">
            <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden beatiful-scrollbar space-y-1">
                {messages.map((m, index) => (
                    <MessageItem
                        message={m}
                        index={index}
                        key={index}
                        messages={reversedMessages}
                        selectConvo={selectConversation}
                        lastMessageStatus={'delivered'}
                    />
                ))}
            </div>
        </div>
    );
};
export default ChatWindowBody;
