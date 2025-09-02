import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTokenData } from "../middleware/getTokenData.js";
import { updContext } from "../controllers/contextController.js";
import { cookieExists } from "../middleware/cookieExists.js";

const router = express.Router();

router.get("/", cookieExists, authMiddleware, getTokenData, updContext);

export default router;
