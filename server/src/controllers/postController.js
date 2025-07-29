import { Post, User } from "../models/User.js"; // TODO update the path after model is setted
// import jwt from "jsonwebtoken";

//
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
      "username email",
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
    const { title, content, status, author } = req.body;

    // Check that author is exist
    const userExists = await User.findById(author);
    if (!userExists) {
      return res.status(400).json({ error: "Author not found" });
    }

    const newPost = await Post.create({ title, content, status, author });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Post endpoint
export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Post endpoint
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Compare the author with the current user
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
