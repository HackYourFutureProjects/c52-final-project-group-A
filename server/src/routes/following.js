import express from "express";
import { getTokenData } from "../middleware/getTokenData.js";
import {
  handleFollowing,
  checkFollowingStatus,
} from "../controllers/followingController.js";

const router = express.Router();

router.post("/", getTokenData, handleFollowing);
router.post("/following-check", getTokenData, checkFollowingStatus);

export default router;
