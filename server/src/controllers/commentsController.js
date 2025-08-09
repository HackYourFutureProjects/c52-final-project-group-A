import mongoose from "mongoose";
import Comment, { validateComment, CommentStatus } from "../models/Comment.js";

// GET /api/comments?post=<postId>
export async function list(req, res, next) {
  try {
    const { post } = req.query;
    if (!post || !mongoose.Types.ObjectId.isValid(post)) {
      return res
        .status(400)
        .json({ message: "post is required and must be ObjectId" });
    }
    const items = await Comment.find({ post, status: CommentStatus.VISIBLE })
      .sort({ created_at: -1 })
      .populate("user", "username avatar")
      .lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

// POST /api/comments { post, content }
export async function create(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { post, content } = req.body || {};
    const commentObject = {
      status: CommentStatus.VISIBLE,
      created_at: new Date(),
      user: req.user.id,
      post,
      content: typeof content === "string" ? content.trim() : content,
    };

    const errors = validateComment(commentObject);
    if (errors.length)
      return res.status(400).json({ message: errors.join("; ") });

    const doc = await Comment.create(commentObject);
    const saved = await Comment.findById(doc._id)
      .populate("user", "username avatar")
      .lean();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}
