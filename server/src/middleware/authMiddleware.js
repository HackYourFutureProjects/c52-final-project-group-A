import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config.js";

const { JWT_SECRET } = config;

export const authMiddleware = async (req, res, next) => {
  try {
    // 1) primary: cookie 'bq_token' (like we have in getProfile)
    let token = req.cookies?.bq_token;

    // 2) optional fallback: Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
