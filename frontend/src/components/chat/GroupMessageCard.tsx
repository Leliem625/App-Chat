import type { Conversation } from '@/types/chat';
import ChatCard from '../chat/ChatCard';
import { useStoreUser } from '../../store/useStoreUser';
import { useStoreChat } from '../../store/useStoreChat';
import UnreadCountBadge from './UnreadBagde';
import MemberAvatar from './MemberAvatar';
const GroupMessageCard = ({ convo }: { convo: Conversation }) => {
    const { user } = useStoreUser();
    const { activeConversationId, setActiveConversation, messages, fetchMessages } = useStoreChat();
    if (!user) return null;

    const otherUser = convo.participants.map((p) => p._id !== user._id);
    if (!otherUser) return null;
    const unreadCounts = convo.unreadCounts[user._id];
    // const lastMessage = convo.lastMessage?.content ?? '';
    const name = convo.group?.name ?? '';
    const handleSelectConversation = async (id: string) => {
        setActiveConversation(id);
        if (!messages[id]) {
            await fetchMessages(id);
        }
    };
    return (
        <ChatCard
            convoId={convo._id}
            name={name}
            timestamp={convo.lastMessage?.createdAt ? new Date(convo.lastMessage?.createdAt) : undefined}
            isActive={activeConversationId === convo._id}
            onSelect={handleSelectConversation}
            unreadCount={unreadCounts}
            leftSection={
                <>
                    <MemberAvatar participants={convo.participants} type="chat" />
                    {unreadCounts > 0 && <UnreadCountBadge unreadCount={unreadCounts} />}
                </>
            }
            subtitle={<p className="text-sm truncate text-muted-foregrounp">{convo.participants.length} thành viên</p>}
        />
    );
};
export default GroupMessageCard;
