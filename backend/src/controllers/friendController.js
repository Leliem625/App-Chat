import User from '../models/userModel.js';
import Friend from '../models/Friend.js';
import FriendRequest from '../models/FriendRequest.js';

class friendController {
    async sendFriendRequest(req, res){
        try{
            const {to, message} = req.body;
            const from = req.user._id;

            if(from === to){
                return res.status(400).json({message: "Không thể gửi lời mời kết bạn cho chính mình!"})
            }

            const userExists = await User.exists({_id: to});

            if(!userExists){
                return res.status(404).json({message: "Người dùng không tồn tại!"});
            }

            let userA = from.toString();
            let userB = to.toString();
            if(userA> userB){
                [userA, userB] = [userB, userA];
            }

            const [alreadyFriends, existingFriends] = await Promise.all([
                Friend.findOne({userA,userB}),
                FriendRequest.findOne({
                    $or: [
                        {from,to},
                        {from:to, to:from}
                    ]
                })
            ]);

            if(alreadyFriends){
                return res.status(400).json({message: "Hai người đã là bạn bè!"})
            }
            if(existingFriends){
                return res.status(400).json({message: "Đã gửi lời mời kết bạn!"})
            }

            const request = await FriendRequest.create({
                from,
                to,
                message
            });

            return res.status(200).json({message:"Gửi lời mời kết bạn thành công!", request})
        }
        catch(error){
            console.error("Lỗi khi gửi yêu cầu kết bạn", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }
    async acceptFriendRequest(req, res){
        try{
            const {requestId} = req.params;

            const userId = req.user._id;
            const request = await FriendRequest.findById(requestId);
            if(!request) {
                return res.status(400).json({message: "Không tìm thấy lời mời kết bạn!"});
            }

            if(request.to.toString()!==userId.toString()){
                return res.status(403).json({message: "Bạn không có quyền chấp nhận lời mời kết bạn này!"});
            }
            const friend = await Friend.create({
                userA: request.from,
                userB: request.to,
            });

            await FriendRequest.findByIdAndDelete(requestId);

            const from = await User.findById(request.from)
            .select("_id displayName avatarUrl")
            .lean();
            return res.status(200).json({
                message: "Chấp nhận lời mời kết bạn thành công!",
                newFriend:{
                    _id: from?._id,
                    displayName: from?.displayName,
                    avatar: from?.avatarUrl,
                }
            });

        }
        catch(error){
            console.error("Lỗi khi chấp nhận lời mời kết bạn", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }
    async  declineFriendRequest (req, res){
        try{
            const {requestId} = req.params;

            const userId = req.user._id;

            const request = await FriendRequest.findById(requestId);

            if(!request) {
                return res.status(400).json({message:"Không tìm thấy lời mời kết bạn!"});
            }

            if(request.to.toString() !== userId.toString()){
                return res.status(403).json({message: "Bạn không có quyên từ chối lời mời kết bạn!"});
            }

            await FriendRequest.findByIdAndDelete(requestId);

            return res.status(200).json({message: "Hủy lời mời kết bạn thành công!"});

        }
        catch(error){
            console.error("Lỗi khi từ chối lời mời kết bạn", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }
    async   getAllFriends(req, res){
        try{
            const userId = req.user._id;

            const friendShips = await Friend.find({
                $or:[
                    {
                        userA: userId
                    },
                    {
                        userB: userId
                    },
                ],
            }).populate("userA", "_id displayName avatarUrl username")
            .populate("userB", "_id displayName avatarUrl username")
            .lean();

            if(!friendShips.length){
                return res.status(400).json({message:"Không có bạn bè nào!"});
            }

            const friends = friendShips.map((f)=>
                f.userA._id.toString() === userId.toString() ? f.userB : f.userA
            );

            return res.status(200).json({message: "Lấy danh sách bạn bè thành công!", friends})


        }
        catch(error){
            console.error("Lỗi khi lấy danh sách bạn bè", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }
    async getFriendRequests(req, res){
        try{
            const userId = req.user._id;
            const friendRequests = await FriendRequest.find({to:userId});
            if(!friendRequests.length){
                return res.status(400).json({message: "Chưa có lời mời kết bạn nào!"})
            }
            return res.status(200).json({message:"Lấy danh sách lời mới kết bạn thành công!", friendRequests})
        }
        catch(error){
            console.error("Lỗi khi lấy danh sách lời mời kết bạn", error);
            return res.status(500).json({ message: "Lỗi hệ thống" });
        }
    }

}

export default new friendController();
