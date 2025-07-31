// routes/weeklyDigest.js
import express from "express";
import { getWeeklyDigest } from "../controllers/weeklyDigestController.js";

const router = express.Router();

// GET /api/users/:id/weekly-digest
router.get("/:id/weekly-digest", getWeeklyDigest);

export default router;
