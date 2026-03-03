import express from 'express';

const router = express.Router();
import { authMe } from "../controllers/userController.js"; 

router.get('/getme', authMe);

export default router;