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
      console.log("=== Like removed ===", userId, postId);
      return res.json({ liked: false });
    } else {
      // If there is no like, we create one
      await Like.create({ user: userId, post: postId });
      console.log("=== Like created ===", userId, postId);
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

export const removeLike = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (!existingLike) {
      return res.status(404).json({ message: "Like not found" });
    }

    await Like.deleteOne({ _id: existingLike._id });

    return res.json({ message: "Like removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
