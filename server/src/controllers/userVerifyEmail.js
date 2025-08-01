import PendingUser from "../models/PendingUser.js";
import User, { validateUser } from "../models/User.js";
import { logError } from "../util/logging.js";

export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  if (!email || !verificationCode) {
    return res
      .status(400)
      .json({ error: "Email and verification code are required" });
  }

  try {
    const pending = await PendingUser.findOne({ email });

    if (!pending) {
      return res
        .status(404)
        .json({ error: "No pending registration found or expired" });
    }

    if (pending.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const userData = {
      email: pending.email,
      username: pending.username,
      profile: {
        first_name: pending.firstName,
        last_name: pending.lastName,
      },
      password: pending.password,
    };
    // Validate user data
    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const newUser = new User(userData);
    await newUser.save();
    await PendingUser.deleteOne({ email });

    return res
      .status(201)
      .json({ message: "Email verified and user created successfully" });
  } catch (err) {
    logError("Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
