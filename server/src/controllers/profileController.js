import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne(
      { _id: id },
      { password: 0, email: 0, admin: 0 },
    ).populate("posts");

    res.status(200).json({ success: true, result: user });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Unable to get profile, try again later",
    });
  }
};
