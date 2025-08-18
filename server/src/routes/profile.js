import { getProfile } from "../controllers/profileController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, getProfile);

export default router;
