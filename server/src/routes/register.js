import express from "express";
import { userRegister } from "../controllers/userRegister.js";
import { verifyEmail } from "../controllers/verifyEmail.js";

const userRouter = express.Router();

userRouter.post("/", userRegister);
userRouter.post("/verify/", verifyEmail);

export default userRouter;
