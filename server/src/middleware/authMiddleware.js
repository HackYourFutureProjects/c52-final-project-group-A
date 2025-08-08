import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  // const authHeader = req.headers.authorization;
  const token = req.cookies["bq_token"];

  // if (!authHeader?.startsWith("Bearer ")) {
  //   return res
  //     .status(401)
  //     .json({ message: "Authorization header missing or malformed" });
  // }
  if (!token) {
    return res.status(401).json({ message: "No token provided in cookies" });
  }

  // const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = await User.findById(decoded.id);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
