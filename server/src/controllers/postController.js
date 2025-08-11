import Post, { PostStatus, validatePost } from "../models/Post.js";

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
    const {
      title,
      content,
      status = PostStatus.DRAFT,
      tags = [],
      published_at,
      score,
    } = req.body;

    // Normalize tags: ensure array of trimmed strings
    const normalizedTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    // Convert published_at to Date if provided
    let pubDate;
    if (published_at) {
      const parsed = new Date(published_at);
      if (!isNaN(parsed.getTime())) {
        pubDate = parsed;
      }
    }

    // Auto-set published_at if status is PUBLISHED and no date was provided
    if (status === PostStatus.PUBLISHED && !pubDate) {
      pubDate = new Date();
    }

    // Build candidate object for validation
    const candidate = {
      status,
      tags: normalizedTags,
      title: typeof title === "string" ? title.trim() : title,
      content: typeof content === "string" ? content.trim() : content,
      published_at: pubDate,
      author: req.user._id,
      score: typeof score === "number" ? score : 0,
    };

    // Validate using custom validatePost function
    const errors = validatePost(candidate);
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    // Save post to database
    const newPost = await Post.create(candidate);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("createPost error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update Post endpoint
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check that only the author can edit
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
