import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.bq_token;

  console.log("authHeader:", authHeader);
  console.log("cookieToken:", cookieToken);

  if (!authHeader?.startsWith("Bearer ") && !cookieToken) {
    return res.status(401).json({ message: "Authorization missing" });
  }

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : cookieToken;
  console.log("token:", token);

  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded:", decoded);

    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    logError(err);
    console.log("JWT verify error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
