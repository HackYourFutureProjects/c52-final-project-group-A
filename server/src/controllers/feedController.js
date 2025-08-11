import Post from "../models/Post.js";
import Follow from "../models/Follow.js";
import { calculatePostScore } from "../util/score.js";
import { logError } from "../util/logging.js";
import Like from "../models/Like.js";
import config from "../config.js";
import { getTrendingPosts } from "../services/trending.js";
import { hasUserSignals } from "../util/userSignals.js";

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!(await hasUserSignals(userId))) {
      const trending = await getTrendingPosts({
        windowHours: 28,
        limit: 10,
        capPerAuthor: 2,
      });
      return res.json({ mode: "cold-start", items: trending });
    }

    const since = new Date(Date.now() - 28 * 3600 * 1000);

    // Get list of users the logged-in user follows
    const following = await Follow.find({ follower: userId }).select(
      "following",
    );
    const followingIds = following.map((f) => f.following);
    const likedPosts = await Like.find({ user: userId })
      .select("post")
      .limit(config.MAX_LIKED_POSTS_LIMIT);
    const likedPostIds = likedPosts.map((like) => like.post);

    // Get posts by followed users from last 7 days
    const recentPosts = await Post.aggregate([
      {
        $match: {
          author: { $in: followingIds },
          published_at: { $gte: since },
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          tags: 1,
          likeCount: 1,
          published_at: 1,
        },
      },
    ]);

    // Get the logged-in user’s tag preference (based on their own posts)
    const userPosts = await Post.find({ author: userId }).select("tags");
    const likedTaggedPosts = await Post.aggregate([
      { $match: { _id: { $in: likedPostIds } } },
      { $project: { tags: 1 } },
    ]);

    const tagFrequency = {};
    userPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });
    // Include tags from liked posts in frequency calculation

    likedTaggedPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Score each post based on user interests
    const homeFeed = recentPosts.map((post) => ({
      ...post,
      score: calculatePostScore(post.likeCount, post.tags, tagFrequency),
    }));

    homeFeed.sort((a, b) => b.score - a.score);

    //  Return both feeds
    res.json({
      mode: "personalized",
      items: homeFeed,
    });
  } catch (err) {
    logError("Error generating feed:", err.message);
    res.status(500).json({ error: "Failed to generate feed" });
  }
};
