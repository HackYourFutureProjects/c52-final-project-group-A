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
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      logError("Google API error:", errorText);
      return res.status(401).json({ msg: "Invalid access token" });
    }

    const payload = await response.json();

    if (!payload || !payload.email) {
      return res
        .status(401)
        .json({ msg: "Token verification failed: invalid payload" });
    }

    const { email, given_name, family_name, sub } = payload;

    if (!email || !sub) {
      return res
        .status(422)
        .json({ msg: "Token payload missing required user info (email, id)" });
    }

    const userData = {
      email,
      profile: {
        first_name: given_name || "Unknown",
        last_name: family_name || "User",
      },
      google_id: sub,
      username: generateUsername(),
    };

    const isValidUser = validateUser(userData);

    if (isValidUser.length > 0) {
      logError("User validation failed:", isValidUser);
      return res.status(400).json({
        msg: "Invalid user data from Google token",
        errors: isValidUser,
      });
    }

    req.user = userData;

    next();
  } catch (err) {
    logError("Google token verification error:", err);
    return res.status(500).json({ msg: "Token verification failed" });
  }
};
