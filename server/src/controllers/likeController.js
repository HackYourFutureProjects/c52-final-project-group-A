import Like from "../models/Like.js";

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    // Check if there is a like from this user for the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // If there is a like, we remove it
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ liked: false });
    } else {
      // If there is no like, we create one
      await Like.create({ user: userId, post: postId });
      return res.json({ liked: true });
    }
  } catch (error) {
    // Handling the rare "duplicate" error at the database level
    if (error.code === 11000) {
      return res.status(409).json({ error: "Like already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
};
