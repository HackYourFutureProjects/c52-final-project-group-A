import sendEmail from "../util/mailer.js";
import generateCode from "../util/codeGenerator.js";
import User, { validateUser } from "../models/User.js";
import PendingUser from "../models/PendingUser.js";
import bcrypt from "bcrypt";
import { logError } from "../util/logging.js";
import config from "../config.js";
import generateUsername from "../util/usernameGenerator.js";

const { SALT_ROUNDS, NODE_ENV } = config;

export const userRegister = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  try {
    const existingUser = await User.findOne({
      email: new RegExp(email, "i"),
    });

    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const existingPendingUser = await PendingUser.findOne({
      email: new RegExp(email, "i"),
    });

    const username = generateUsername();

    const userData = {
      email,
      username,
      profile: {
        first_name: firstName,
        last_name: lastName,
      },
      password,
    };

    const validationErrors = validateUser(userData);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const verificationCode = generateCode();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    if (existingPendingUser) {
      existingPendingUser.username = username;
      existingPendingUser.password = hashedPassword;
      existingPendingUser.first_name = firstName;
      existingPendingUser.last_name = lastName;
      existingPendingUser.verification_code = verificationCode;
      existingPendingUser.createdAt = new Date();
      await existingPendingUser.save();
    } else {
      const pending = new PendingUser({
        username,
        password: hashedPassword,
        email,
        first_name: firstName,
        last_name: lastName,
        verification_code: verificationCode,
      });
      await pending.save();
    }

    await sendEmail(email, verificationCode);

    res.cookie("bq-registrationEmail", email, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to email",
    });
  } catch (err) {
    logError("Error in userRegister:", err);
    return res.status(500).json({ msg: "An internal server error occurred" });
  }
};
