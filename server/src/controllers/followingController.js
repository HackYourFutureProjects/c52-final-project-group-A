import User from "../models/User.js";

export const handleFollowing = async (res, req) => {
  const { tokenData, authorId } = req.body;
  const { userId } = tokenData;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const following = user.following.includes(authorId);
  if (following) {
    user.following = user.following.filter((id) => id.toString() !== authorId);
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Unfollowed successfully" });
  } else {
    user.following.push(authorId);
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Followed successfully" });
  }
};
