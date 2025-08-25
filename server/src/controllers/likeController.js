import mongoose from "mongoose";
import Like from "../models/Like.js";
import User from "../models/User.js";

// Controller for toggling like (like/unlike)
export const toggleLike = async (req, res) => {
  // 0. Validate postId format before anything else
  const { id: postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ success: false, msg: "Invalid postId" });
  }

  const userId = req.user._id;
  const postObjectId = new mongoose.Types.ObjectId(postId);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Check if a like already exists
    const existingLike = await Like.findOne({
      user: userId,
      post: postObjectId,
    }).session(session);

    if (existingLike) {
      // 2. Remove the like and from user's array
      await Like.deleteOne({ _id: existingLike._id }).session(session);
      await User.findByIdAndUpdate(
        userId,
        { $pull: { likes: existingLike._id } },
        { session },
      );
      await session.commitTransaction();
      // RETURN FLAT STRUCTURE:
      return res.json({ success: true, liked: false });
    } else {
      // 3. If the like does not exist, create it and add its id to user's likes array
      const [newLike] = await Like.create([{ user: userId, post: postId }], {
        session,
      });
      await User.findByIdAndUpdate(
        userId,
        { $push: { likes: newLike._id } },
        { session },
      );
      await session.commitTransaction();
      // RETURN FLAT STRUCTURE:
      return res.json({ success: true, liked: true });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error("Toggle Like Error:", error);
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, msg: "Like already exists" });
    }
    return res.status(500).json({ success: false, msg: "Server error" });
  } finally {
    session.endSession();
  }
};

// Controller to get like status for the current user and post
export const getLikeStatus = async (req, res) => {
  const { id: postId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ success: false, msg: "Invalid postId" });
  }
  const postObjectId = new mongoose.Types.ObjectId(postId);
  const userId = req.user._id;

  try {
    const existingLike = await Like.findOne({
      user: userId,
      post: postObjectId,
    });
    res.json({ success: true, liked: !!existingLike });
  } catch (error) {
    console.error("Get Like Status Error:", error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
