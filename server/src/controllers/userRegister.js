import sendEmail from "../util/mailer.js";
import generateCode from "../util/codeGenerator.js";
import User, { validateUser } from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import bcrypt from "bcrypt";
import { logError } from "../util/logging.js";
import config from "../config.js";
import generateUsername from "../util/usernameGenerator.js";

const { SALT_ROUNDS } = config;

export const userRegister = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const username = generateUsername();

  try {
    const existingUser = await User.findOne({
      $or: [
        { username: new RegExp(username, "i") },
        { email: new RegExp(email, "i") },
      ],
    });

    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const userData = {
      email,
      username,
      profile: {
        first_name: firstName,
        last_name: lastName,
      },
      password: hashedPassword,
    };

    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const verificationCode = generateCode();

    await PendingUser.deleteOne({ email });

    const pending = new PendingUser({
      username,
      password: hashedPassword,
      email,
      first_name: firstName,
      last_name: lastName,
      verification_code: verificationCode,
    });

    await pending.save();

    await sendEmail(email, verificationCode);

    return res.status(200).json({
      message: "Verification code sent to email",
    });
  } catch (err) {
    logError("Error in userRegister:", err);
    return res.status(500).json({ msg: "An internal server error occurred" });
  }
};
