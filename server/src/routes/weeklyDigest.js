// routes/weeklyDigest.js
import express from "express";
import { getWeeklyDigest } from "../controllers/weeklyDigestController.js";

const router = express.Router({ mergeParams: true });

// GET /api/users/:id/weekly-digest
router.get("/weekly-digest", getWeeklyDigest);

export default router;
