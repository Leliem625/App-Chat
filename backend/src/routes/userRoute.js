import express from 'express';

const router = express.Router();
import { authMe } from "../controllers/userController.js"; 
import {Test} from '../controllers/userController.js'
router.get('/getme', authMe);
router.get('/test', Test)
export default router;