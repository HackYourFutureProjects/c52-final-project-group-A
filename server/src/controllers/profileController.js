import User from "../models/User.js";
import { logError } from "../util/logging.js";
import jwt from "jsonwebtoken";
import config from "../config.js";

const { JWT_SECRET } = config;

export const getProfile = async (req, res) => {
  try {
    const { bq_token } = req.cookies;
    if (!bq_token) {
      return res.status(401).json({
        success: false,
        msg: "You need to be logged in to view this page",
      });
    }

    let tokenData;
    try {
      tokenData = jwt.verify(bq_token, JWT_SECRET);
    } catch (err) {
      logError(err);
      return res.status(400).json({
        success: false,
        msg: "Token is invalid",
      });
    }

    const user = await User.findById(tokenData.userId, { password: 0 });
    res.status(200).json({ success: true, result: user });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Unable to get profile, try again later",
    });
  }
};

/*
// This is left here for future reference

export const createUser = async (req, res) => {
  try {
    const user = req.body?.user;

    if (typeof user !== "object") {
      res.status(400).json({
        success: false,
        msg: `You need to provide a 'user' object. Received: ${JSON.stringify(
          user,
        )}`,
      });

      return;
    }

    const errorList = validateUser(user);

    if (errorList.length > 0) {
      res
        .status(400)
        .json({ success: false, msg: validationErrorMessage(errorList) });
    } else {
      const newUser = await User.create(user);

      res.status(201).json({ success: true, user: newUser });
    }
  } catch (error) {
    logError(error);
    res
      .status(500)
      .json({ success: false, msg: "Unable to create user, try again later" });
  }
};

*/
