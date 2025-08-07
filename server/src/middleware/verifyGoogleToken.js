import { OAuth2Client } from "google-auth-library";
import { logError } from "../util/logging.js";
import config from "../config.js";

const { CLIENT_ID } = config;
const client = new OAuth2Client(CLIENT_ID);

export const verifyGoogleToken = async (req, res, next) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ msg: "No token provided" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();

    req.user = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      username: payload.email.split("@")[0].toLowerCase(),
    };

    next();
  } catch (err) {
    logError("Google token verification error:", err);
    return res.status(401).json({ msg: "Invalid Google token" });
  }
};
