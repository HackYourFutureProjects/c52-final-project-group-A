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
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logError("Login attempt with incorrect password for email:", email);
      return res.status(401).json({ msg: "Invalid email or password" });
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

    const userResponse = Object.fromEntries(
      Object.entries(user).filter(
        ([key]) => key !== "password" && key !== "__v",
      ),
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userResponse,
    });
  } catch (err) {
    logError("Login error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
