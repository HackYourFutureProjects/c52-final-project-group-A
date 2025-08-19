import Post, { PostStatus, validatePost } from "../models/Post.js";
import mongoose from "mongoose";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Post By ID endpoint
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username profile score",
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Post endpoint
export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      status = PostStatus.DRAFT,
      tags = [],
      score,
      published_at,
    } = req.body ?? {};

    const safeTitle = typeof title === "string" ? title.trim() : title;
    const safeContent = typeof content === "string" ? content.trim() : content;

    const normTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const created_at = new Date();

    let finalPublishedAt;
    if (status === PostStatus.PUBLISHED) {
      const maybeDate = published_at ? new Date(published_at) : null;
      finalPublishedAt =
        maybeDate && !isNaN(maybeDate.getTime()) ? maybeDate : new Date();
    }

    const candidate = {
      title: safeTitle,
      content: safeContent,
      status,
      tags: normTags,
      score,
      author: req.user._id,
      created_at,
      published_at: finalPublishedAt,
    };

    const errors = validatePost(candidate);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const newPost = await Post.create(candidate);
    const populated = await newPost.populate("author", "username email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Post endpoint
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, msg: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, msg: "Not authorized to update this post" });
    }

    // Allowed fields
    const allowedFields = ["title", "content", "tags", "status"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const statusTo = updates.status ?? post.status;

    // Update published_at only if the status changes
    if (statusTo === "PUBLISHED") {
      updates.published_at = new Date();
    } else if (post.status === "PUBLISHED" && statusTo !== "PUBLISHED") {
      // Only reset published_at if transitioning from PUBLISHED to a non-published status
      updates.published_at = null;
    }

    // Prepare candidate for validation
    const candidate = { ...post.toObject(), ...updates };
    const errors = validatePost(candidate);
    if (errors.length) {
      return res.status(400).json({
        success: false,
        msg: errors.join("; "),
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res
        .status(404)
        .json({ success: false, msg: "Post not found after update" });
    }

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

// Delete Post endpoint
export const deletePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
