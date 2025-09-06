import Post from "../models/Post.js";
import User from "../models/User.js";
import { calculatePostScore } from "../util/score.js";

export async function generateWeeklyDigest(limit = 50, skip = 0) {
  const users = await User.find().skip(skip).limit(limit);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const recentPosts = await Post.aggregate([
    {
      $match: {
        published_at: { $gte: oneWeekAgo },
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

  const digestByUser = [];

  for (const user of users) {
    const userPosts = recentPosts.filter(
      (post) => post.author?.toString() === user._id.toString(),
    );
    const tagFrequency = {};

    userPosts.forEach((post) => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        });
      }
    });

    const scoredPosts = recentPosts.map((post) => ({
      title: post.title,
      content: post.content,
      tags: post.tags,
      score: calculatePostScore(post.likeCount, post.tags, tagFrequency),
    }));

    scoredPosts.sort((a, b) => b.score - a.score);

    digestByUser.push({
      userId: user._id,
      email: user.email,
      topPosts: scoredPosts.slice(0, 5),
    });
  }

  return digestByUser;
}
