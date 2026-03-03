import { useStoreUser } from '@/store/useStoreUser';
import UserAvatar from '../chat/UserAvatar';
import MemberAvatar from '../chat/MemberAvatar';
import { useStoreChat } from '@/store/useStoreChat';
import type { Conversation } from '@/types/chat';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
const ChatWelcomeScreen = ({ chat }: { chat?: Conversation }) => {
    const { user } = useStoreUser();
    const { conversations, activeConversationId } = useStoreChat();

    let otherUser;

    chat = chat ?? conversations.find((p) => p._id === activeConversationId);

    if (!chat) {
        return (
            <header className="md:hidden sticky top-0 z-10 flex items-center gap-2 px-4 py-2 w-full">
                <SidebarTrigger className="-ml-1 text-foreground" />
            </header>
        );
    }

    if (chat.type === 'direct') {
        const otherUsers = chat.participants.filter((p) => p._id !== user?._id);
        otherUser = otherUsers.length > 0 ? otherUsers[0] : null;

        if (!user || !otherUser) return;
    }

    return (
        <header className='sticky top-0 flex items-center z-10 px-4 py-2 bg-background border-b border-gray-200 shadow-sm rounded-xl'>
            <div className ='flex items-center gap-2 w-full'>
                <SidebarTrigger className="-ml-1 text-foreground" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <div className='flex gap-2 items-center p-2'>
                    <div className='relative'>
                        {chat.type === 'direct' ? (
                            <UserAvatar
                                type={'sidebar'}
                                name={otherUser?.displayName || 'Moij'}
                                avatarUrl={otherUser?.avatarUrl || undefined}
                            />
                        ) : (
                            <MemberAvatar participants={chat.participants} type={"sidebar"}/>
                        )}
                    </div>
                    <h2 className='text-xl font-semibold text-foreground'>{chat.type==='direct' ? otherUser?.displayName: chat.group?.name}</h2>
                </div>
            </div>
        </header>
    );
};
export default ChatWelcomeScreen;
