import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js'
class ConversationController {
    async createConversation(req, res){
        try{
            const {type, name, memberIds } = req.body;
            const userId = req.user._id;
            if(!type 
            || (type === 'group' && !name) 
            || !memberIds 
            || memberIds.length === 0 
            ||  !Array.isArray(memberIds)){
                return res.status(400).json({message: "Tên nhóm và danh sách thành viên là bắt buộc!"})
            }

            let conversation;

            if(type === 'direct' && memberIds.length === 1){
                const participantId = memberIds[0];

                conversation = await Conversation.findOne({
                    type: 'direct',
                    "participants.userId": {$all: [userId, participantId]}  
                })
                if(!conversation){
                    conversation = await Conversation.create({
                        type: 'direct',
                        participants: [{userId}, {userId: participantId}],
                        lastMessageAt: new Date(),
                    })
                }
                await conversation.save();
            }

            if(type === 'group'){
                conversation = new Conversation({
                    type: 'group',
                    participants: [{userId}, ...memberIds.map((id)=>({userId:id}))],
                    group: {
                        name,
                        createBy: userId,
                    },
                    lastMessageAt: new Date()
                })
                await conversation.save();
            }

            if(!conversation){
                return res.status(400).json({message: "Chưa thể tạo cuộc trò chuyện!"});
            }
            await conversation.populate(
                [
                    {path: "participants.userId", select: "displayName avatarUrl"},
                    {path: "seenBy", select: "displayName avatarUrl"},
                    {path:"lastMessage.sendBy", select: "displayName avatarUrl"}
                ]
            );

            const participants = (conversation.participants || []).map((p) => ({
                _id: p?.userId._id,
                displayName: p?.userId.displayName,
                avatarUrl: p?.userId.avatarUrl ?? null,
                joinedAt: p.joinedAt,
            }));

            const formatted = {...conversation.toObject(), participants};

            return res.status(200).json({message:"Tạo cuộc trò chuyện thành công!",conversation: formatted});
        }
        catch(error){
            console.error("Lỗi khi tạo cuộc trò chuyện!", error);
            return res.status(500).json({message: "Lỗi hệ thống!"})
        }
    }
    async getConversation(req,res){
        try{
            const userId = req.user._id;

            const conversations = await Conversation.find({
                "participants.userId": userId
            }).sort({lastMessageAt: -1, updatedAt: -1})
            .populate({
                path: "participants.userId",
                select:"displayName avatarUrl"
            })
            .populate({
                path:"lastMessage.sendBy",
                select: "displayName avatarUrl"
            })
            .populate({
                path: "seenBy",
                select: 'displayName avatarUrl'
            });
            if(!conversations){
                return res.status(400).json({message:"Không có cuộc trò chuyện nào!"});
            }
            const formatted = conversations.map((convo)=>{
              const participants =  (convo.participants || []).map((p)=>({
                    _id: p?.userId._id,
                    displayName: p?.userId.displayName,
                    avatarUrl: p?.userId.avatarUrl ?? null,
                    joinedAt: p?.joinedAt
                }))

                return {...convo.toObject(),
                    unreadCounts: convo.unreadCounts || {},
                    participants
                }
            });

           

            return res.status(200).json({conversations:formatted});
        }
        catch(error){
            console.error("Lỗi khi lấy cuộc trò chuyện", error);
            return res.status(500).json({message:"Lỗi hệ thống!"});
        }
    }
    async getMessage(req,res){
       try {
                const { conversationId } = req.params;
                const { limit = 15, cursor } = req.query;

                const query = { conversationId };

                if (cursor) {
                const date = new Date(cursor);

                if (!isNaN(date.getTime())) {
                    query.createdAt = { $lt: date };
                }
                }

                let messages = await Message.find(query)
                .sort({ createdAt: -1 })
                .limit(Number(limit) + 1);

                let nextCursor = null;

                if (messages.length > Number(limit)) {
                const nextMessage = messages[messages.length - 1];
                nextCursor = nextMessage.createdAt.toISOString();
                messages.pop();
                }

                messages = messages.reverse();

                return res.status(200).json({
                messages,
                nextCursor,
                });
            } catch (error) {
                console.error("Lỗi xảy ra khi lấy messages", error);
                return res.status(500).json({ message: "Lỗi hệ thống" });
            }
    }
    async getConversationId(userId){
        try{
             const conversations = await Conversation.find(
                { "participants.userId": userId },
                { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
        }
        catch(error){
            console.error("Lỗi khi lấy cuộc trò chuyện!", error);
            return [];
        }
    }
    
}
export default new ConversationController();