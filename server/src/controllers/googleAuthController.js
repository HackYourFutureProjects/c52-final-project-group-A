import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { logError } from "../util/logging.js";
import config from "../config.js";

const { JWT_SECRET, NODE_ENV } = config;

export const googleAuth = async (req, res) => {
  const { email, profile, google_id, username } = req.user;

  try {
    let user = await User.findOne({
      $or: [{ email }, { google_id }],
    });

    if (!user) {
      const userData = {
        email,
        username,
        profile,
        google_id,
      };

      user = new User(userData);
      await user.save();
    } else if (user.google_id == null || user.google_id === "") {
      user.google_id = google_id;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("bq_token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Google login successful",
    });
  } catch (err) {
    logError("Google auth controller error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
