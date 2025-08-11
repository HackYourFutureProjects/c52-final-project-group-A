import Post from "../models/Post.js";

export async function getTrendingPosts({
  windowHours = 28,
  limit = 10,
  capPerAuthor = 2,
} = {}) {
  const since = new Date(Date.now() - windowHours * 3600 * 1000);

  const rawPosts = await Post.aggregate([
    { $match: { published_at: { $gte: since } } },
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
        author: 1,
        published_at: 1,
      },
    },
  ]);

  // Score = likes × time decay (half-life = 9h)
  const HALF_LIFE_H = 9;
  const decayRate = Math.log(2) / HALF_LIFE_H;

  const scored = rawPosts.map((post) => {
    const hoursAgo =
      (Date.now() - new Date(post.published_at).getTime()) / 36e5;
    const decay = Math.exp(-decayRate * hoursAgo);
    return { ...post, score: post.likeCount * decay };
  });

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  // Cap per author for variety
  const seen = new Map();
  const items = [];
  for (const post of scored) {
    const authorId = String(post.author);
    const count = seen.get(authorId) || 0;
    if (count < capPerAuthor) {
      items.push(post);
      seen.set(authorId, count + 1);
      if (items.length >= limit) break;
    }
  }

  return items;
}
