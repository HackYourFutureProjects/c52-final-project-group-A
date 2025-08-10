import PendingUser from "../models/PendingUser.js";
import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  const cookieEmail = req.cookies["bq-registrationEmail"];

  try {
    if (cookieEmail && email !== cookieEmail) {
      return res.status(400).json({
        msg: "Email mismatch. Try again later.",
      });
    }

    const pending = await PendingUser.findOne({ email });

    if (!pending) {
      return res
        .status(404)
        .json({ msg: "No pending registration found or expired" });
    }

    if (pending.verification_code !== verificationCode) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    const userData = {
      email: pending.email,
      username: pending.username,
      profile: {
        first_name: pending.first_name,
        last_name: pending.last_name,
      },
      password: pending.password,
    };

    const newUser = new User(userData);
    await newUser.save();
    await PendingUser.deleteOne({ email });

    // Clear the registration email cookie
    res.clearCookie("bq-registrationEmail");

    return res
      .status(201)
      .json({ message: "Email verified and user created successfully" });
  } catch (err) {
    logError("User verification error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};
