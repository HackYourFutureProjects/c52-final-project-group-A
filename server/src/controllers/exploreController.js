import { getTrendingPosts } from "../services/trending.js";
import { getTopCreators } from "../services/topCreators.js";
import { getTrendingTags } from "../services/trendingTags.js";
import { logError } from "../util/logging.js";

export const getExplore = async (req, res) => {
  try {
    const [trendingPosts, topCreators, trendingTags] = await Promise.all([
      getTrendingPosts({ windowHours: 168, limit: 20, capPerAuthor: 1 }),
      getTopCreators({ windowHours: 260, limit: 4 }),
      getTrendingTags({ windowHours: 168, limit: 4 }),
    ]);

    const randomizedTrendingPosts = trendingPosts.map((post) => {
      const maxHoursAgo = 168; // 7 days
      const randomHoursAgo = Math.random() * maxHoursAgo;
      const newPublishedAt = new Date(
        Date.now() - randomHoursAgo * 3600 * 1000,
      );
      return { ...post, published_at: newPublishedAt };
    });

    res.json({
      success: true,
      mode: "explore",
      trendingPosts: randomizedTrendingPosts,
      topCreators,
      trendingTags,
    });
  } catch (err) {
    logError("Error in getExplore:", err.message);
    res.status(500).json({ msg: "Failed to load explore content" });
  }
};
