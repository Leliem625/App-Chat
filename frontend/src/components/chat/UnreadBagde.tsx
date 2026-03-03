import { Badge } from '../ui/bagde';
const UnreadCountBadge = ({ unreadCount }: { unreadCount: number }) => {
    return (
        <div className="absolute z-20 -top-1 -right-1 pulse-ring">
            <Badge className="size-5 flex items-center bg-gradient-chat justify-center p-0 text-xs border border-background ">
                {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
        </div>
    );
};
export default UnreadCountBadge;
