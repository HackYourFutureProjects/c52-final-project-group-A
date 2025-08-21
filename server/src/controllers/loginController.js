import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { logError } from "../util/logging.js";
import config from "../config.js";

const { JWT_SECRET, NODE_ENV } = config;

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      logError("Login attempt with non-existing email:", email);
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password" });
    }

    if (user.google_id) {
      return res.status(401).json({
        success: false,
        msg: "This account is linked to Google. Please sign in using the Google login button.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logError("Login attempt with incorrect password for email:", email);
      return res
        .status(401)
        .json({ success: false, msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("bq_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    logError(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
