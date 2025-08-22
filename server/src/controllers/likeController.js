import mongoose from "mongoose";
import Like from "../models/Like.js";
import User from "../models/User.js";

// Controller for toggling like (like/unlike)
export const toggleLike = async (req, res) => {
  // 1. Create a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    // 2. Check if a like already exists
    const existingLike = await Like.findOne({
      user: userId,
      post: postId,
    }).session(session);

    if (existingLike) {
      // 3. If the like exists, remove it and also remove its id from user's likes array
      await Like.deleteOne({ _id: existingLike._id }).session(session);
      await User.findByIdAndUpdate(
        userId,
        { $pull: { likes: existingLike._id } },
        { session },
      );
      await session.commitTransaction();
      return res.json({ liked: false });
    } else {
      // 4. If the like does not exist, create it and add its id to user's likes array
      const newLike = await Like.create({ user: userId, post: postId }, {
        session,
      });
      await User.findByIdAndUpdate(
        userId,
        { $push: { likes: newLike._id } },
        { session },
      );
      await session.commitTransaction();
      return res.json({ liked: true });
    }
  } catch (error) {
    // 5. If there is an error, abort the transaction
    await session.abortTransaction();
    if (error.code === 11000) {
      return res.status(409).json({ error: "Like already exists" });
    }
    res.status(500).json({ error: "Server error" });
  } finally {
    // 6. End the session
    session.endSession();
  }
};

// Get like status for the current user and post
export const getLikeStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    // Check if the like exists
    const existingLike = await Like.findOne({ user: userId, post: postId });

    res.json({ liked: !!existingLike });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
