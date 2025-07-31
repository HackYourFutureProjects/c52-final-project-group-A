// routes/feed.js
import express from "express";
import { getFeed } from "../controllers/feedController.js";

const router = express.Router();

// GET /api/feed

router.get("/", getFeed);

export default router;
