import express from "express";
import Post from "../models/Post.js";
import { calculatePostScore } from "../util/score.js";
import { logError } from "../util/logging.js";

const router = express.Router();

router.get("/:id/weekly-digest", async (req, res) => {
  try {
    const userId = req.params.id;

    // Get tag frequency from user's own posts
    const userPosts = await Post.find({ author: userId });
    const tagFrequency = {};

    userPosts.forEach((post) => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      }
    });

    // Get posts from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentPosts = await Post.aggregate([
      {
        $match: {
          created_at: { $gte: oneWeekAgo },
          tags: { $exists: true, $ne: [] },
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
          title: 1,
          content: 1,
          tags: 1,
          likeCount: 1,
        },
      },
    ]);

    const scoredPosts = recentPosts.map((post) => ({
      title: post.title,
      content: post.content,
      tags: post.tags,
      score: calculatePostScore(post.likeCount, post.tags, tagFrequency),
    }));

    // Sort and return top 5
    scoredPosts.sort((a, b) => b.score - a.score);

    res.json(scoredPosts.slice(0, 5));
  } catch (err) {
    logError("Error generating weekly digest:", err);
    res.status(500).json({ error: "Failed to generate weekly digest" });
  }
});

export default router;
