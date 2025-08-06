import express from "express";
import { userRegister } from "../controllers/userRegister.js";
import { verifyEmail } from "../controllers/userVerifyEmail.js";
import validateRegisterBody from "../middleware/validateRegisterBody.js";
import validateVerifyEmailBody from "../middleware/validateVerifyEmailBody.js";

const router = express.Router();

router.post("/", validateRegisterBody, userRegister);
router.post("/verify", validateVerifyEmailBody, verifyEmail);

export default router;
