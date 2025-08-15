import express from "express";
import { toggleLike, removeLike } from "../controllers/likeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/posts/:id/like", authMiddleware, toggleLike);
router.delete("/posts/:id/like", authMiddleware, removeLike);

export default router;
