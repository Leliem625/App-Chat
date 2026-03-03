import { useStoreChat } from '../../store/useStoreChat';
import GroupMessageCard from '../chat/GroupMessageCard';
const GroupChatList = () => {
    const { conversations } = useStoreChat();
    if (!conversations) return;

    const groupConversations = conversations.filter((convo) => convo.type !== 'direct');
    return (
        <div className="flex flex-col space-y-2">
            {groupConversations.map((convo) => (
                <GroupMessageCard key={convo._id} convo={convo} />
            ))}
        </div>
    );
};
export default GroupChatList;
