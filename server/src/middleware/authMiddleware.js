import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const authMiddleware = async (req, res, next) => {
  const { bq_token } = req.cookies;
  if (!bq_token) {
    return res.status(401).json({ msg: "No token provided" });
  }
  try {
    const decoded = jwt.verify(bq_token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (err) {
    logError(err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
