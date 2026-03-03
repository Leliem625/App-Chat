import { useStoreChat } from '../../store/useStoreChat';
import DirectMessageCard from './DirectMessageCard';

const DirectMessage = () => {
    const { conversations } = useStoreChat();
    if (!conversations) console.log('123');

    const directConversation = conversations.filter((p) => p.type === 'direct');
    return (
        <div className="flex flex-col space-y-2">
            {directConversation.map((convo) => (
                <DirectMessageCard convo={convo} key={convo._id} />
            ))}
        </div>
    );
};
export default DirectMessage;
