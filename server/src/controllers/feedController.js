import User from "../models/User.js";
import Post from "../models/Post.js";
import Follow from "../models/Follow.js";
import { calculateUserScore, calculatePostScore } from "../util/score.js";
import { logError } from "../util/logging.js";
import Like from "../models/Like.js";
import config from "../config.js";

const { MAX_LIKED_POSTS_LIMIT } = config;
// ...

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    // top creators
    const ranked = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "userPosts",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "userPosts._id",
          foreignField: "post",
          as: "likesReceived",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "_id",
          foreignField: "following",
          as: "followerCount",
        },
      },
      {
        $lookup: {
          from: "posts",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$author", "$$userId"] } } },
            {
              $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "post",
                as: "postLikes",
              },
            },
            {
              $addFields: {
                likeCount: { $size: "$postLikes" },
              },
            },
            { $sort: { likeCount: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 1,
                title: 1,
                content: 1,
                likeCount: 1,
                created_at: 1,
              },
            },
          ],
          as: "topPost",
        },
      },
      { $unwind: { path: "$topPost", preserveNullAndEmptyArrays: true } },
    ]);

    const topCreators = ranked.map((user) => {
      const likesCount = user.likesReceived.length;
      const followersCount = user.followerCount.length;

      return {
        username: user.username,
        topPost: user.topPost,
        score: calculateUserScore(likesCount, followersCount),
      };
    });

    topCreators.sort((a, b) => b.score - a.score);

    // logged-in feed...
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get list of users the logged-in user follows
    const following = await Follow.find({ follower: userId }).select(
      "following",
    );
    const followingIds = following.map((f) => f.following);
    const likedPosts = await Like.find({ user: userId })
      .select("post")
      .limit(MAX_LIKED_POSTS_LIMIT);
    const likedPostIds = likedPosts.map((like) => like.post);

    // Get posts by followed users from last 7 days
    const recentPosts = await Post.aggregate([
      {
        $match: {
          author: { $in: followingIds },
          published_at: { $gte: oneWeekAgo },
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
      homeFeed: homeFeed.slice(0, 10), // personalized for logged-in user
      topCreators: topCreators.slice(0, 5), // global trending creators
    });
  } catch (err) {
    logError("Error generating feed:", err.message);
    res.status(500).json({ error: "Failed to generate feed" });
  }
};
