import type { Participant } from '@/types/chat';
import UserAvatar from './UserAvatar';
import { Ellipsis } from 'lucide-react';
interface AvatarGroup {
    participants: Participant[];
    type: 'chat' | 'sidebar';
}

const MemberAvatar = ({ participants, type }: AvatarGroup) => {
    const avatar = [];
    const limit = Math.min(participants.length, 4);

    for (let i = 0; i < limit; i++) {
        const member = participants[i];
        avatar.push(
            <UserAvatar
                type={type}
                key={i}
                name={member.displayName ?? undefined}
                avatarUrl={member.avatarUrl ?? undefined}
            />,
        );
    }
    return (
        <div className="flex -space-x-3 *:data-[slot=avatar]:ring-background realtive *:data-[slot=avatar]:ring-2">
            {avatar}
            {participants.length > limit && (
                <div className="flex items-center z-10 justify-center size-8 rounded-full bg-muted ring-2 ring-background text-muted-foreground">
                    <Ellipsis className="size-4" />
                </div>
            )}
        </div>
    );
};
export default MemberAvatar;
