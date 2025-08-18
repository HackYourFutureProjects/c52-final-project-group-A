import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const handleFollowing = async (req, res) => {
  const { authorId } = req.body;
  const { userId } = req.tokenData;

  try {
    const isAuthor = await User.findById(authorId);
    if (!isAuthor) {
      return res
        .status(404)
        .json({ success: false, message: "Author not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const following = user.following
      .map((id) => id.toString())
      .includes(authorId.toString());

    if (following) {
      // Unfollow
      user.following = user.following.filter(
        (id) => id.toString() !== authorId.toString(),
      );
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Unfollowed successfully" });
    } else {
      // Follow
      user.following.push(authorId);
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Followed successfully" });
    }
  } catch (err) {
    logError("Error handling follow/unfollow:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const checkFollowingStatus = async (req, res) => {
  const { authorId } = req.body;
  const { userId } = req.tokenData;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isFollowing = user.following
      .map((id) => id.toString())
      .includes(authorId.toString());

    return res.status(200).json({
      success: true,
      status: isFollowing,
    });
  } catch (err) {
    logError("Error checking following status:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
