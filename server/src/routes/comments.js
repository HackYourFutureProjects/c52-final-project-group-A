import { Router } from "express";
import Comment from "../models/Comment.js";

const router = Router();

// Get comments
router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const list = await Comment.find({
      post: req.params.postId,
      status: "VISIBLE",
    })
      .sort({ created_at: 1 })
      .populate("user", "username");
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: "Failed to load comments" });
  }
});

export default router;
