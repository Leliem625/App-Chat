import { useStoreUser } from '@/store/useStoreUser';
import type { Conversation } from '../../types/chat';
import ChatCard from '../chat/ChatCard';
import { useStoreChat } from '@/store/useStoreChat';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';
import StatusChat from './StatusChat';
import UnreadCountBadge from './UnreadBagde';
import { useStoreSocket } from '@/store/useStoreSocket';

const DirectMessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useStoreUser();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useStoreChat();
    const { onlineUsers } = useStoreSocket();
    if (!user) return null;
    const otherUser = convo.participants.find((p) => p._id !== user._id);
    if (!otherUser) return null;
    const unreadCounts = convo.unreadCounts[user._id];
    const lastMessage = convo.lastMessage?.content ?? '';

    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            await fetchMessages(id);
        }
    };
    return (
        <ChatCard
            convoId={convo._id}
            name={otherUser.displayName ?? ''}
            timestamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage.createdAt) : undefined}
            isActive={activeConversationId === convo._id}
            onSelect={handleSelectConversation}
            leftSection={
                <>
                    <UserAvatar
                        type="sidebar"
                        name={otherUser.displayName ?? ''}
                        avatarUrl={otherUser.avatarUrl ?? undefined}
                    />
                    <StatusChat status={onlineUsers.includes(otherUser?._id ?? '') ? 'online' : 'offline'} />
                    {unreadCounts > 0 && <UnreadCountBadge unreadCount={unreadCounts} />}
                </>
            }
            subtitle={
                <p
                    className={cn(
                        'text-sm truncate',
                        unreadCounts > 0 ? 'font-medium text-foreground' : 'text-muted-foregroundS',
                    )}
                >
                    {lastMessage}
                </p>
            }
        />
    );
};
export default DirectMessageCard;
