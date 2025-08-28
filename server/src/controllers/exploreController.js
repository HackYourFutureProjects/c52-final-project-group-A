import { getTrendingPosts } from "../services/trending.js";
import { getTopCreators } from "../services/topCreators.js";
import { getTrendingTags } from "../services/trendingTags.js";
import { logError } from "../util/logging.js";

export const getExplore = async (req, res) => {
  try {
    const [trendingPosts, topCreators, trendingTags] = await Promise.all([
      getTrendingPosts({ windowHours: 720, limit: 10, capPerAuthor: 2 }),
      getTopCreators({ windowHours: 168, limit: 4 }),
      getTrendingTags({ windowHours: 720, limit: 4 }),
    ]);

    res.json({
      success: true,
      mode: "explore",
      trendingPosts,
      topCreators,
      trendingTags,
    });
  } catch (err) {
    logError("Error in getExplore:", err.message);
    res.status(500).json({ msg: "Failed to load explore content" });
  }
};
