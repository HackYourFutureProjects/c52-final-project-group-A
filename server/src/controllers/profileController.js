import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const getProfile = async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({
      success: false,
      msg: "Username is required",
    });
  }

  try {
    const user = await User.findOne(
      { username },
      { password: 0, email: 0, admin: 0 },
    ).populate("posts");

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({ success: true, result: user });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Unable to get profile, try again later",
    });
  }
};
