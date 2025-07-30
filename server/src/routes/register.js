import express from "express";

const userRouter = express.Router();

userRouter.post("/", () => {});
userRouter.post("/verify/", () => {});

export default userRouter;
