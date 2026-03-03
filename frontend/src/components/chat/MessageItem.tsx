import { cn, formatMessageTime } from '@/lib/utils';
import type { Conversation, Message } from '@/types/chat';
import UserAvatar from './UserAvatar';
import { Card } from '../ui/card';
import { Badge } from '../ui/bagde';
import { useState } from 'react';

interface MessageItemProps {
    message: Message;
    index: number;
    messages: Message[];
    selectConvo: Conversation;
    lastMessageStatus: 'delivered' | 'seen';
}

const MessageItem = ({ message, index, messages, selectConvo, lastMessageStatus }: MessageItemProps) => {
    const prev = messages[index - 1];
    const [activeId, setActiveId] = useState<string | null>(null);
    const isGroupBreak =
        index === 0 ||
        message.senderId === prev?.senderId ||
        new Date(message.createdAt).getTime() - new Date(prev?.createdAt).getTime() < 300000;

    const participant = selectConvo.participants.find((p) => p._id.toString() === message.senderId.toString());

    return (
        <div className={cn('flex gap-2 message-bounce', message.isOwn ? 'justify-end' : 'justify-start')}>
            {/* Avatar */}
            {!message.isOwn && (
                <div className="w-8">
                    {isGroupBreak && (
                        <UserAvatar
                            type="chat"
                            name={participant?.displayName || 'Moij'}
                            avatarUrl={participant?.avatarUrl || undefined}
                        />
                    )}
                </div>
            )}
            {/* Message */}

            <div
                className={cn(
                    'max-w-xs lg:max-w-md space-y-1 flex flex-col',
                    message.isOwn ? 'items-end' : 'items-start',
                )}
                onClick={() => setActiveId((prev) => (prev === message._id ? null : message._id))}
            >
                {activeId === message._id && (
                    <span
                        className={`text-xs px-1 transition-all duration-200 ${
                            activeId === message._id ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'
                        } overflow-hidden`}
                    >
                        {formatMessageTime(new Date(message?.createdAt))}
                    </span>
                )}
                <Card className={cn('p-3', message.isOwn ? 'chat-bubble-sent border-0' : 'chat-bubble-received ')}>
                    <p className="text-sm leading-relaxed wrap-break-word">{message.content}</p>
                </Card>

                {message.isOwn && message._id === selectConvo.lastMessage?._id && activeId === message._id && (
                    <Badge
                        className={cn(
                            'text-xs px-1.5 h-3 border-0',
                            lastMessageStatus === 'seen'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground',
                        )}
                        variant="outline"
                    >
                        {lastMessageStatus}
                    </Badge>
                )}
            </div>
        </div>
    );
};
export default MessageItem;
