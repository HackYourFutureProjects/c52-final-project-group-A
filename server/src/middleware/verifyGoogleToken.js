import { OAuth2Client } from "google-auth-library";
import { logError } from "../util/logging.js";
import config from "../config.js";
import generateUsername from "../util/usernameGenerator.js";
import { validateUser } from "../models/User.js";

const { CLIENT_ID } = config;
const client = new OAuth2Client(CLIENT_ID);

export const verifyGoogleToken = async (req, res, next) => {
  const { credential } = req.body;

  if (!credential || typeof credential !== "string") {
    return res
      .status(400)
      .json({ msg: "No token provided or token is invalid type" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res
        .status(401)
        .json({ msg: "Token verification failed: no payload" });
    }

    const { email, given_name, family_name, sub } = payload;

    if (!email || !sub || !given_name || !family_name) {
      return res
        .status(422)
        .json({ msg: "Token payload missing required user info" });
    }

    const userData = {
      email,
      profile: {
        first_name: given_name,
        last_name: family_name,
      },
      google_id: sub,
      username: generateUsername(),
    };

    const isValidUser = validateUser(userData);

    if (isValidUser.length > 0) {
      return res
        .status(400)
        .json({ msg: "Invalid user data from Google token" });
    }

    req.user = userData;

    next();
  } catch (err) {
    logError("Google token verification error:", err);
    return res.status(401).json({ msg: "Invalid Google token" });
  }
};
