import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/post", getAllPosts);
router.get("/post/:id", getPostById);
router.post("/post", authMiddleware, createPost); // Protect the route
router.put("/post/:id", authMiddleware, updatePost); // Protect the route
router.delete("/post/:id", authMiddleware, deletePost); // Protect the route

export default router;
