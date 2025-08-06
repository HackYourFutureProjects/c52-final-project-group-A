import express from "express";
import { loginUser } from "../controllers/loginController.js";
import { logoutUser } from "../controllers/logoutController.js";
import validateLoginBody from "../middleware/validateLoginBody.js";

const router = express.Router();

router.post("/", validateLoginBody, loginUser);
router.post("/logout", logoutUser);

export default router;
