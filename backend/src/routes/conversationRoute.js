import express from 'express';
import ConversationController from '../controllers/conversationController.js';
import {checkFriend} from '../middlewares/friendCheckMiddlewares.js';
const router = express.Router();

router.post("/",checkFriend, ConversationController.createConversation);
router.get("/", ConversationController.getConversation);
router.get("/:conversationId/messages", ConversationController.getMessage);
export default router;