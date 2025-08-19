import Like from "../models/Like.js";
import User from "../models/User.js";

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    // Check if there is a like from this user for the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // If there is a like, we delete it and remove the id from the user's likes array
      await Like.deleteOne({ _id: existingLike._id });
      await User.findByIdAndUpdate(userId, {
        $pull: { likes: existingLike._id },
      });
      return res.json({ liked: false });
    } else {
      // If there is no like, we create one
      const newLike = await Like.create({ user: userId, post: postId });
      // Add the id of the new like to the user's likes array
      await User.findByIdAndUpdate(userId, { $push: { likes: newLike._id } });
      return res.json({ liked: true });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Like already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

export const getLikeStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    // Search for this user's like on this post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    res.json({ liked: !!existingLike });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
