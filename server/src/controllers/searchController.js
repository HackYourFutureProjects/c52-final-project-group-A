import User from "../models/User.js";
import Post from "../models/Post.js";
import { LogError } from "../util/logging.js";
export const search = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = { $regex: q, $options: "i" }; // case-insensitive search

    let users = [];
    let posts = [];

    // Search for users
    if (type === "user" || !type) {
      users = await User.find({
        $or: [
          { username: regex },
          { email: regex },
          { "profile.first_name": regex },
          { "profile.last_name": regex },
        ],
      })
        .select("username profile")
        .limit(5)
        .lean();
    }

    //  Search for posts (only if type=post or not specified)
    if (type === "post" || !type) {
      posts = await Post.find({
        $or: [{ title: regex }, { content: regex }, { tags: regex }],
      })
        .select("title content author tags")
        .populate("author", "username")
        .limit(5)
        .lean();
    }

    posts = posts.map((post) => ({
      ...post,
      content:
        post.content?.length > 100
          ? post.content.slice(0, 100) + "..."
          : post.content, // trim content to 100 chars if needed
    }));
    return res.status(200).json({ users, posts });
  } catch (err) {
    LogError("Error in search controller:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
