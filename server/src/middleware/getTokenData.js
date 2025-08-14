import config from "../config.js";
import jwt from "jsonwebtoken";
import { logError } from "../util/logging.js";

export const getTokenData = (req, res, next) => {
  const { JWT_SECRET } = config;
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

  req.body.tokenData = tokenData;
  next();
};
