import express from "express";

const userRouter = express.Router();

userRouter.post("/", () => {});
userRouter.post("/verify-email/", () => {});

export default userRouter;
