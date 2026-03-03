import Conversation from '../models/Conversation.js';
import Friend from '../models/Friend.js';
const pair = (a,b) => (a<b ? [a,b] : [b,a]);
export const checkFriend = async (req,res,next) => {
    try{
        const me = req.user._id.toString();

        const recipientId = req.body?.recipientId ?? null;
        
        const memberIds = req.body?.memberIds ?? [];

        if(!recipientId && memberIds.length ===0 ){
            return res.status(400).json({message: "Thiếu thông tin người nhận"})
        }

        if(recipientId){
            const [userA, userB] = pair(me, recipientId);

            const friend = await Friend.findOne({userA, userB});

            if(!friend){
                return res.status(400).json({message: "Hai người không phải là bạn bè của nhau!"})
            }

            return next();
        }

        if(memberIds.length>0){
            const friendsCheck = memberIds.map(async(memberId) => {
                const [userA, userB] = pair(me,memberId);
                const friend = await Friend.findOne({userA, userB});
                return friend ? null : memberId;
            })

            const results = await Promise.all(friendsCheck);
            const notFriends = results.filter(Boolean);

            if(notFriends.length>0){
                return res.status(403).json({message:"Chỉ là bạn bè mới có thể thêm vào nhóm", notFriends})
            }
            return next();
        }
    }
    catch(error){
        console.error("Lỗi xảy ra khi checkFriendship:", error);
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
}