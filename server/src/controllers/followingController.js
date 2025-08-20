import User from "../models/User.js";
import Follow from "../models/Follow.js";
import { logError } from "../util/logging.js";
import mongoose from "mongoose";

export const handleFollowing = async (req, res) => {
  const { authorId } = req.body;
  const { userId } = req.tokenData;

  // Start a session for transaction
  const session = await mongoose.startSession();

  try {
    // Start transaction
    await session.startTransaction();

    // Check if the author exists
    const author = await User.findById(authorId).session(session);
    if (!author) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, msg: "Author not found" });
    }

    // Check if the current user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if user is already following the author
    const following = user.following
      .map((id) => id.toString())
      .includes(authorId.toString());

    if (following) {
      // Remove author from user's following list
      user.following = user.following.filter(
        (id) => id.toString() !== authorId.toString(),
      );

      // Remove user from author's followers list
      author.followers = author.followers.filter(
        (id) => id.toString() !== userId.toString(),
      );

      // Delete the follow relationship from Follow collection
      await Follow.deleteOne({
        follower: userId,
        following: authorId,
      }).session(session);

      // Save changes to both user documents
      await user.save({ session });
      await author.save({ session });

      // Commit transaction
      await session.commitTransaction();

      return res
        .status(200)
        .json({ success: true, message: "Unfollowed successfully" });
    } else {
      // Add author to user's following list
      user.following.push(authorId);

      // Add user to author's followers list
      author.followers.push(userId);

      // Create new follow relationship in Follow collection
      await Follow.create(
        [
          {
            follower: userId,
            following: authorId,
            created_at: new Date(),
          },
        ],
        { session },
      );

      // Save changes to both user documents
      await user.save({ session });
      await author.save({ session });

      // Commit transaction
      await session.commitTransaction();

      return res
        .status(200)
        .json({ success: true, message: "Followed successfully" });
    }
  } catch (err) {
    // Abort transaction on error
    await session.abortTransaction();
    logError("Error handling follow/unfollow:", err);
    return res.status(500).json({
      success: false,
      msg: "Failed to process follow/unfollow request",
    });
  } finally {
    // End session
    await session.endSession();
  }
};

export const checkFollowingStatus = async (req, res) => {
  const { authorId } = req.body;
  const { userId } = req.tokenData;

  try {
    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if user is following the specified author
    const isFollowing = user.following
      .map((id) => id.toString())
      .includes(authorId.toString());

    return res.status(200).json({
      success: true,
      isFollowing,
    });
  } catch (err) {
    logError("Error checking following status:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
