import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const socketMiddlewares = async(socket,next) =>{
    try{
        const token = socket.handshake.auth?.token;
        if(!token) {
            return next(new Error('Thiếu token!'))
        }
        const decode =  jwt.verify(token, process.env.JWT_SECRET);

        if(!decode){
            return next(new Error("Thiếu acessToken hoặc acessToken không hợp lệ!"))
        }
        const user = await User.findById(decode.userId);

        if(!user){
            return next(new Error("Người dùng không tồn tại"))
        }

         socket.user = user ;
       next();
    }
    catch(error){
        console.log("Lỗi hệ thống", error);
        return next(new Error('Unauthorized'));
    }
};
