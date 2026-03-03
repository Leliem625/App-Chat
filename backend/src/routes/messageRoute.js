import express from 'express';
import messageController from '../controllers/messageController.js';
import {checkFriend} from '../middlewares/friendCheckMiddlewares.js';
const router = express.Router();

router.post('/send',checkFriend, messageController.sendMessage )
router.post('/sendgroup',  messageController.sendMessageGroup)
export default router;