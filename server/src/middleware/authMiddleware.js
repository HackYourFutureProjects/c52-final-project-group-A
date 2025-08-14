import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.bq_token;

  if (!authHeader?.startsWith("Bearer ") && !cookieToken) {
    return res.status(401).json({ message: "Authorization missing" });
  }

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : cookieToken;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    logError(err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
