import express from "express";
import { search } from "../controllers/searchController.js";

const router = express.Router();

// GET /api/search

router.get("/", search);

export default router;
