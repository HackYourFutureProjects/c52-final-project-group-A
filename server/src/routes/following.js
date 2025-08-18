import express from "express";
import { getTokenData } from "../middleware/getTokenData.js";
import {
  handleFollowing,
  checkFollowingStatus,
} from "../controllers/followingController.js";

const router = express.Router();

router.post("/", getTokenData, handleFollowing);
router.post("/Following-Check", getTokenData, checkFollowingStatus);

export default router;
