import express from "express";
import { loginUser } from "../controllers/loginController.js";
import { googleAuth } from "../controllers/googleAuthController.js";
import { logoutUser } from "../controllers/logoutController.js";
import validateLoginBody from "../middleware/validateLoginBody.js";
import { verifyGoogleToken } from "../middleware/verifyGoogleToken.js";

const router = express.Router();

router.post("/", validateLoginBody, loginUser);
router.post("/Google_Auth", verifyGoogleToken, googleAuth);
router.post("/logout", logoutUser);

export default router;
