import Post from "../models/Post.js";
import Follow from "../models/Follow.js";
import { calculatePostScore } from "../util/score.js";
import { logError } from "../util/logging.js";
import Like from "../models/Like.js";
import config from "../config.js";
import { getTrendingPosts } from "../services/trending.js";
import { hasUserSignals } from "../util/userSignals.js";
import mongoose from "mongoose";

const { FEED_WINDOW_HOURS } = config;

export const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!(await hasUserSignals(userId))) {
      const trending = await getTrendingPosts({
        windowHours: 28,
        limit: 10,
        capPerAuthor: 2,
      });
      return res.json({
        success: true,
        data: { mode: "cold-start", items: trending },
      });
    }
    const since = new Date(Date.now() - FEED_WINDOW_HOURS * 3600 * 1000);

    // Get list of users the logged-in user follows
    const following = await Follow.find({ follower: userId }).select(
      "following",
    );
    const followingIds = following.map((f) => f.following);

    const likedPosts = await Like.find({ user: userId })
      .select("post")
      .limit(config.MAX_LIKED_POSTS_LIMIT);
    const likedPostIds = likedPosts.map((like) => like.post.toString()); // now we convert to string for comparison

    const matchCondition = {
      published_at: { $gte: since },
    };
    if (followingIds.length > 0) {
      matchCondition.author = { $in: followingIds };
    }

    // Get posts by followed users from last 7 days
    const recentPosts = await Post.aggregate([
      {
        $match: matchCondition,
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
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorData",
        },
      },
      {
        $unwind: "$authorData",
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          author: {
            _id: "$authorData._id",
            username: "$authorData.username",
            score: "$authorData.score",
            profile: "$authorData.profile",
          },
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
          author: 1,
        },
      },
    ]);

    if (recentPosts.length === 0) {
      // If no recent posts, fall back to trending
      const trending = await getTrendingPosts({
        windowHours: 28,
        limit: 10,
        capPerAuthor: 2,
      });
      return res.json({
        success: true,
        data: { mode: "cold-start", items: trending },
      });
    }

    // Get the logged-in user’s tag preference (based on their own posts)
    const userPosts = await Post.find({ author: userId }).select("tags");

    // If you want to get tags from liked posts, fetch them separately:
    const likedTaggedPosts = await Post.find({
      _id: { $in: likedPostIds.map((id) => new mongoose.Types.ObjectId(id)) },
    }).select("tags");

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
      likedByMe: likedPostIds.includes(post._id.toString()), // New field added
    }));

    homeFeed.sort((a, b) => b.score - a.score);

    //  Return both feeds
    res.json({
      success: true,
      data: {
        mode: "personalized",
        items: homeFeed,
      },
    });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Failed to generate feed",
    });
  }
};
