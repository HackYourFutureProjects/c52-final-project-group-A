import User from "../models/User.js";
import Post from "../models/Post.js";
import { logError } from "../util/logging.js";

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export const search = async (req, res) => {
  try {
    const { q, type } = req.query;
    const SEARCH_QUERY_MAX_LENGTH = 100;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    if (q.length > SEARCH_QUERY_MAX_LENGTH) {
      return res.status(400).json({
        message: "Search query exceeds maximum length of 100 characters",
      });
    }
    const safeQ = escapeRegex(q);
    const regex = { $regex: safeQ, $options: "i" };

    let users = [];
    let posts = [];

    // Search for users
    if (type === "user" || !type) {
      users = await User.find({
        $or: [
          { username: regex },
          { "profile.first_name": regex },
          { "profile.last_name": regex },
        ],
      })
        .select("username profile")
        .limit(5)
        .lean();
    }

    //  Search for posts.
    if (type === "post" || !type) {
      posts = await Post.find({
        $or: [{ title: regex }, { tags: regex }],
      })
        .select("title author tags")
        .populate("author", "username")
        .limit(5)
        .lean();
    }

    return res.status(200).json({ users, posts });
  } catch (err) {
    logError("Error in search controller:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
