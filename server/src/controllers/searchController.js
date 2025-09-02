import User from "../models/User.js";
import Post from "../models/Post.js";
import { logError } from "../util/logging.js";

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SearchQueryMaxLength = 100;

export const search = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ success: false, msg: "Search query is required" });
    }
    if (q.length > SearchQueryMaxLength) {
      return res.status(400).json({
        success: false,
        msg: "Search query exceeds maximum length of 100 characters",
      });
    }

    const safeQ = escapeRegex(q);
    const regex = { $regex: safeQ, $options: "i" };

    let users = [];
    let posts = [];

    if (type === "user" || !type) {
      users = await User.find({
        $or: [
          { username: regex },
          { "profile.first_name": regex },
          { "profile.last_name": regex },
        ],
      })
        .select("_id username profile")
        .limit(5)
        .lean();
    }

    if (type === "post" || !type) {
      posts = await Post.find({
        $or: [{ title: regex }, { tags: regex }],
      })
        .select("_id title author tags")
        .populate("author", "username")
        .limit(5)
        .lean();
    }

    return res.status(200).json({ success: true, users, posts });
  } catch (err) {
    logError("Error in search controller:", err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
