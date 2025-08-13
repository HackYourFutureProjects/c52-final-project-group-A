import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import config from "../config.js";
const { LIKE_WEIGHT, FOLLOWER_WEIGHT, POST_WEIGHT } = config;

export async function getTopCreators({ windowHours = 168, limit = 5 } = {}) {
  const since = new Date(Date.now() - windowHours * 3600 * 1000);

  //  Find recent posts and group by author
  const posts = await Post.aggregate([
    { $match: { published_at: { $gte: since } } },
    {
      $group: {
        _id: "$author",
        postCount: { $sum: 1 },
        postIds: { $push: "$_id" },
      },
    },
  ]);

  //  Count likes on those post IDs
  const authorStats = await Promise.all(
    posts.map(async (authorGroup) => {
      const likeCount = await Like.countDocuments({
        post: { $in: authorGroup.postIds },
      });

      const followerCount = await Follow.countDocuments({
        following: authorGroup._id,
      });

      const score =
        likeCount * LIKE_WEIGHT +
        followerCount * FOLLOWER_WEIGHT +
        authorGroup.postCount * POST_WEIGHT;

      return {
        authorId: authorGroup._id,
        postCount: authorGroup.postCount,
        likeCount,
        followerCount,
        score,
      };
    }),
  );

  const sorted = authorStats.sort((a, b) => b.score - a.score).slice(0, limit);

  //Fetch user data
  const userIds = sorted.map((u) => u.authorId);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "_id username profilePic",
  );

  // Merge user info with score data
  const creators = sorted.map((stat) => {
    const user = users.find(
      (u) => u._id.toString() === stat.authorId.toString(),
    );
    return {
      ...stat,
      username: user?.username || "unknown",
      profilePic: user?.profilePic || null,
    };
  });

  return creators;
}
