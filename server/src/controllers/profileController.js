import User from "../models/User.js";
import { logError } from "../util/logging.js";

// Get Profile
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

// Update Profile
export const updateProfile = async (req, res) => {
  const { username } = req.params;
  const { profile = {} } = req.body;

  if (req.user.username !== username) {
    return res.status(403).json({
      success: false,
      msg: "You can edit only your own profile.",
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Merging old and new profile
    const updatedProfile = { ...user.profile.toObject(), ...profile };
    user.profile = updatedProfile;

    await user.save();

    // We trim unnecessary fields for the answer
    const userToSend = await User.findOne(
      { username },
      { _id: 1, username: 1, profile: 1, posts: 1, score: 1, created_at: 1 },
    ).populate({
      path: "posts",
      populate: {
        path: "author",
        select: "_id username profile score",
      },
    });

    res.status(200).json({ success: true, user: userToSend });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Unable to update profile, try again later",
      error: err.message,
    });
  }
};
