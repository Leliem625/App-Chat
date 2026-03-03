import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {socketMiddlewares} from '../middlewares/socketMiddlewares.js'
import ConversationController from '../controllers/conversationController.js'
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: process.env.LIENT_URL,
        credentials: true,
    },
});
io.use(socketMiddlewares);
const onlineUsers = new Map();
io.on("connection", async(socket)=>{
    const user = socket.user;
    onlineUsers.set(user._id, socket.id);
    io.emit("online-users", Array.from(onlineUsers.keys()));
    const conversations = await ConversationController.getConversationId(user._id);
    conversations.forEach((p) => (
        socket.join(p)
    ))
    socket.on("disconnect", ()=>{
        onlineUsers.delete(user._id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    })
});
export {io, app, server}