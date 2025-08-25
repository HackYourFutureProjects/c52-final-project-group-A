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
      { _id: 1, username: 1, profile: 1, posts: 1, score: 1, created_at: 1 },
    ).populate({
      path: "posts",
      populate: {
        path: "author",
        select: "_id username profile score",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Unable to get profile, try again later",
    });
  }
};
