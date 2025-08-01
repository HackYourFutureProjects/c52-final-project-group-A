import express from "express";
import { userRegister } from "../controllers/userRegister.js";
import { verifyEmail } from "../controllers/userVerifyEmail.js";

const router = express.Router();

router.post("/", userRegister);
router.post("/verify", verifyEmail);

export default router;
