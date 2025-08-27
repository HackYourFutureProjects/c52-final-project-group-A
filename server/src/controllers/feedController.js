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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!(await hasUserSignals(userId))) {
      const trending = await getTrendingPosts({
        windowHours: 28,
        limit: limit,
        capPerAuthor: 2,
        skip: skip,
      });

      const totalTrending = await Post.countDocuments({
        status: "PUBLISHED",
        published_at: { $gte: new Date(Date.now() - 28 * 3600 * 1000) },
      });

      return res.json({
        success: true,
        data: {
          mode: "cold-start",
          items: trending,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTrending / limit),
            totalItems: totalTrending,
            hasNext: page * limit < totalTrending,
            hasPrev: page > 1,
          },
        },
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
    const likedPostIds = likedPosts.map((like) => like.post.toString());

    const matchCondition = {
      published_at: { $gte: since },
    };
    if (followingIds.length > 0) {
      matchCondition.author = { $in: followingIds };
    }

    // Count total posts for pagination
    const totalPosts = await Post.countDocuments(matchCondition);

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
      { $skip: skip },
      { $limit: limit },
    ]);

    if (recentPosts.length === 0 && page === 1) {
      // If no recent posts, fall back to trending
      const trending = await getTrendingPosts({
        windowHours: 28,
        limit: limit,
        capPerAuthor: 2,
      });

      const totalTrending = await Post.countDocuments({
        status: "PUBLISHED",
        published_at: { $gte: new Date(Date.now() - 28 * 3600 * 1000) },
      });

      return res.json({
        success: true,
        data: {
          mode: "cold-start",
          items: trending,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTrending / limit),
            totalItems: totalTrending,
            hasNext: page * limit < totalTrending,
            hasPrev: page > 1,
          },
        },
      });
    }

    // Get the logged-in user's tag preference (based on their own posts)
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

    likedTaggedPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Score each post based on user interests
    const homeFeed = recentPosts.map((post) => ({
      ...post,
      score: calculatePostScore(post.likeCount, post.tags, tagFrequency),
      likedByMe: likedPostIds.includes(post._id.toString()),
    }));

    homeFeed.sort((a, b) => b.score - a.score);

    //  Return both feeds
    res.json({
      success: true,
      data: {
        mode: "personalized",
        items: homeFeed,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalItems: totalPosts,
          hasNext: page * limit < totalPosts,
          hasPrev: page > 1,
        },
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
