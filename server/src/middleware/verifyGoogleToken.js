import { logError } from "../util/logging.js";
import generateUsername from "../util/usernameGenerator.js";
import { validateUser } from "../models/User.js";

export const verifyGoogleToken = async (req, res, next) => {
  const { access_token } = req.body;

  if (!access_token || typeof access_token !== "string") {
    return res
      .status(400)
      .json({ msg: "No access token provided or token is invalid type" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout
    let response;

    try {
      response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return res.status(401).json({ msg: "Invalid access token" });
    }

    const userInfo = await response.json();
    const { email, given_name, family_name, id } = userInfo;

    if (!email || !id || !given_name || !family_name) {
      return res
        .status(422)
        .json({ msg: "Missing required user info from Google" });
    }

    const userData = {
      email,
      profile: {
        first_name: given_name,
        last_name: family_name,
      },
      google_id: id,
      username: generateUsername(),
    };

    const isValidUser = validateUser(userData);

    if (isValidUser.length > 0) {
      return res.status(400).json({ msg: "Invalid user data from Google" });
    }

    req.user = userData;
    next();
  } catch (err) {
    if (err.name === "AbortError") {
      logError("Google API request timeout:", err);
      return res.status(408).json({ msg: "Request to Google API timed out" });
    }
    logError("Google token verification error:", err);
    return res.status(401).json({ msg: "Failed to verify Google token" });
  }
};
