import { Router } from "express";
import { list, create } from "../controllers/commentsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", list);
router.post("/", authMiddleware, create);

export default router;
