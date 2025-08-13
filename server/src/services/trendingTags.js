import Post from "../models/Post.js";

export async function getTrendingTags({ windowHours = 28, limit = 4 } = {}) {
  const since = new Date(Date.now() - windowHours * 3600 * 1000);

  const posts = await Post.aggregate([
    { $match: { published_at: { $gte: since } } },
    { $project: { tags: 1 } },
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

  // Return tag names
  return posts.map((t) => t._id);
}
