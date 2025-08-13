import Follow from "../models/Follow.js";
import Like from "../models/Like.js";
import Post from "../models/Post.js";

export async function hasUserSignals(userId) {
  const [followsCount, likesCount, postsCount] = await Promise.all([
    Follow.countDocuments({ follower: userId }),
    Like.countDocuments({ user: userId }),
    Post.countDocuments({ author: userId }),
  ]);
  return followsCount + likesCount + postsCount > 0;
}
