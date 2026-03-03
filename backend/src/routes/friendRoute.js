import friendController from '../controllers/friendController.js';
import express from 'express';

const router = express.Router();

router.post('/send-request',friendController.sendFriendRequest);

router.post("/requests/accept/:requestId", friendController.acceptFriendRequest);
router.post("/requests/:requestId/decline", friendController.declineFriendRequest);

router.get("/", friendController.getAllFriends);
router.get('/get-request', friendController.getFriendRequests);
export default router;