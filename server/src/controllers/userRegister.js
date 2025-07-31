import { sendEmail } from "../util/emailService.js";
import generateCode from "../util/codeGenerator.js";
import User from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import bcrypt from "bcryptjs";
import { LogError } from "concurrently";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

export const userRegister = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const username = email.split("@")[0].toLowerCase();

  try {
    const existingUser = await User.findOne({
      $or: [
        { username: new RegExp(username, "i") },
        { email: new RegExp(email, "i") },
      ],
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const verificationCode = generateCode();

    await PendingUser.deleteOne({ email });

    const pending = new PendingUser({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      verificationCode,
    });

    await pending.save();

    await sendEmail(email, verificationCode);

    return res.status(200).json({
      message: "Verification code sent to email",
    });
  } catch (err) {
    LogError("Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
