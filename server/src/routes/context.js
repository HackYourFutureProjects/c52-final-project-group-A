import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTokenData } from "../middleware/getTokenData.js";
import { updContext } from "../controllers/contextController.js";

const router = express.Router();

router.get("/", authMiddleware, getTokenData, updContext);

export default router;
