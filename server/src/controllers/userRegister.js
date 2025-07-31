import { sendEmail } from "../util/emailService.js";
import generateCode from "../util/codeGenerator.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LogError } from "concurrently";

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = process.env.SALT_ROUNDS;

export const userRegister = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const username = email.split("@")[0];

  // All checking for user will be done in front end, so we only need to check if the user already exists

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

    const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));

    const verificationCode = generateCode();

    const tokenPayload = {
      email,
      firstName,
      lastName,
      username,
      password: hashedPassword,
      verificationCode,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "10m" });

    await sendEmail(email, verificationCode);

    return res.status(200).json({
      message: "Verification code sent to email",
      token, // Send the token back to the client for verification email later
    });
  } catch (err) {
    LogError("[userRegister] Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
