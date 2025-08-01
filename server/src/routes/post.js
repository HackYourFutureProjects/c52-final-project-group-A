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

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", authMiddleware, createPost); // Protect the route
router.put("/:id", authMiddleware, updatePost); // Protect the route
router.delete("/:id", authMiddleware, deletePost); // Protect the route

export default router;
