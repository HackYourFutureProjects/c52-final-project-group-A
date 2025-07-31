import User from "../models/User.js";
import { calculateUserScore } from "../util/score.js";
import { logError } from "../util/logging.js";

export const getFeed = async (req, res) => {
  try {
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
                createdAt: 1,
              },
            },
          ],
          as: "topPost",
        },
      },
      { $unwind: { path: "$topPost", preserveNullAndEmptyArrays: true } },
    ]);

    const usersWithScore = ranked.map((user) => {
      const likesCount = user.likesReceived.length;
      const followersCount = user.followerCount.length;

      return {
        username: user.username,
        topPost: user.topPost,
        score: calculateUserScore(likesCount, followersCount),
      };
    });

    usersWithScore.sort((a, b) => b.score - a.score);

    res.json(usersWithScore);
  } catch (err) {
    logError("Error generating feed:", err.message);
    res.status(500).json({ error: "Failed to generate feed" });
  }
};
