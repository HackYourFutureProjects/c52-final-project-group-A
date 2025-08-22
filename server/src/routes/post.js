import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPostId,
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.get("/:id/comments", getCommentsByPostId);
router.post("/", authMiddleware, createPost); // Protect the route
router.patch("/:id", authMiddleware, updatePost); // Protect the route
router.delete("/:id", authMiddleware, deletePost); // Protect the route

export default router;
