import { useState } from 'react';
import { cn, formatOnlineTime } from '../../lib/utils';
import { Card } from '../ui/card';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useStoreChat } from '@/store/useStoreChat';

interface ChatCardProps {
    convoId: string;
    name: string;
    timestamp?: Date;
    isActive: boolean;
    onSelect: (id: string) => void;
    unreadCount?: number;
    leftSection: React.ReactNode;
    subtitle: React.ReactNode;
}
const ChatCard = ({
    convoId,
    name,
    timestamp,
    isActive,
    onSelect,
    unreadCount,
    leftSection,
    subtitle,
}: ChatCardProps) => {
    const [showDelete, setShowDelete] = useState(false);
    // const [id, setId] = useState<string | null>(null);
    const { deleteConversation } = useStoreChat();
    const handleDeleteConversation = async (id: string) => {
        await deleteConversation(id);
    };
    return (
        <Card
            key={convoId}
            className={cn(
                'borde-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30',
                isActive && 'bg-blue-100 hover:bg-blue-100',
            )}
            onClick={() => onSelect(convoId)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">{leftSection}</div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3
                            className={cn(
                                'font-semibold text-sm truncate',
                                unreadCount && unreadCount > 0 && 'text-foreground',
                            )}
                        >
                            {name}
                        </h3>

                        <span className="text-xs text-muted-foreground">
                            {timestamp ? formatOnlineTime(timestamp) : ''}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-1 min-w-0">{subtitle}</div>
                        <div className="group">
                            <MoreHorizontal
                                className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth"
                                onClick={() => setShowDelete((prev) => !prev)}
                            />
                            {showDelete && (
                                <Trash2
                                    className="size-4 text-red-500 cursor-pointer hover:size-5 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteConversation(convoId);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
export default ChatCard;
