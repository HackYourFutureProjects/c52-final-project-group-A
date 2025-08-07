import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { logError } from "../util/logging.js";

const createSessionToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

export const googleAuth = async (req, res) => {
  const { email, firstName, lastName, username } = req.user;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username,
        email,
        profile: {
          first_name: firstName,
          last_name: lastName,
        },
      });

      await user.save();
    }

    const token = createSessionToken(user);

    return res.status(200).json({
      message: "Authentication successful",
      token,
    });
  } catch (err) {
    logError("Google auth controller error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
