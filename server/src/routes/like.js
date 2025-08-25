import express from "express";
import { toggleLike, getLikeStatus } from "../controllers/likeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posts/:id/like", authMiddleware, toggleLike);
router.get("/posts/:id/like", authMiddleware, getLikeStatus);

export default router;
