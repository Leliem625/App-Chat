import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './libs/connectedDB.js';
import authUser from './routes/authUser.js';
import userRoute from './routes/userRoute.js';
import friendRoute from './routes/friendRoute.js';
import messageRoute from './routes/messageRoute.js';
import conversationRoute from './routes/conversationRoute.js'
import { protectedRoute } from './middlewares/authMiddlewares.js';
import cors from "cors";
import cookieParser from "cookie-parser";
import {app, server} from './socket/index.js';
dotenv.config()

// const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

connectDB();


app.use('/api/auth', authUser);

//private Router
app.use(protectedRoute)
app.use('/api/user', userRoute)
app.use('/api/friend', friendRoute);
app.use('/api/message', messageRoute)
app.use('/api/conversations', conversationRoute)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});