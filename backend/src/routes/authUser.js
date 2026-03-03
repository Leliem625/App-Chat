import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", authController.signUp);

router.post("/signin", authController.signIn);

router.get("/signout", authController.signOut);
router.post("/refresh", authController.refreshToken);

export default router;