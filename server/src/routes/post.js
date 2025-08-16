import express from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsPerUser,
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.get("/user/:id", getPostsPerUser);
router.post("/", authMiddleware, createPost); // Protect the route
router.patch("/:id", authMiddleware, updatePost); // Protect the route
router.delete("/:id", authMiddleware, deletePost); // Protect the route

export default router;
