import express from "express";
import { getExplore } from "../controllers/exploreController.js";

const router = express.Router();

router.get("/", getExplore);

export default router;
