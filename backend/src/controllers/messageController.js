import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import {updateConversationAfterCreateMessage} from '../utils/messageHelper.js';
import {emitNewMessage} from '../utils/messageHelper.js';
import {io} from '../socket/index.js';
class messageController{
    async sendMessage(req,res){
        try{
            const {recipientId, content, conversationId} = req.body;
            
            const senderId = req.user._id;
           
            if(!content){
                return res.status(400).json({message: "Tin nhắn gửi đi không được để trống!"});
            };

            let conversation;

            if(conversationId){
                conversation = await Conversation.findById(conversationId);
            }

            //Nếu không có tạo cuộc trò chuyện mới
            if(!conversation){
                conversation = await Conversation.create({
                    type: "direct",
                    participants:[
                        {userId:senderId, joinedAt: new Date()},
                        {userId:recipientId, joinedAt:new Date()}
                    ],
                    lastMessageAt:new Date(),
                    unreadCounts: new Map(),
                })
            }
            //Tạo tin nhắn
            const message = await Message.create({
                conversationId: conversation._id,
                senderId,
                content
            })
            //Cập nhất lại đoạn chat khi có người gủi tin nhắn mới
            updateConversationAfterCreateMessage(conversation, message, senderId);

           await conversation.save();
           emitNewMessage(io,conversation,message);
           return res.status(200).json({message})

        }
        catch(error){
            console.log(error);
            return res.status(500).json({message:"Không thể gửi được tin nhắn!"});
        }
    }
    async sendMessageGroup(req,res){
        try{
            const {conversationId, content} = req.body;
            const senderId = req.user._id;

            const conversation = await Conversation.findById(conversationId);
            if(!conversation) {
                return res.status(404).json({message:"Cuộc trò chuyện không tồn tại!"})
            };

            if (!content) {
                return res.status(400).json("Thiếu nội dung");
            }

            const message = await Message.create({
            conversationId,
            senderId,
            content,
            });

            updateConversationAfterCreateMessage(conversation, message, senderId);
            await conversation.save();
            emitNewMessage(io,conversation,message);
            return res.status(200).json({message});
        }
        catch(error){
            console.error("Lỗi khi gửi tin nhắn nhóm", error);
            return res.status(500).json({message:"Lỗi hệ thống!"})
        }
    }
}
export default new messageController();