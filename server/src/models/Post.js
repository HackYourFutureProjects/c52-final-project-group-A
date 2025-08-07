import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

export const PostStatus = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
};

const postSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(PostStatus),
    required: true,
  },
  tags: { type: [String], default: [] },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  published_at: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  score: { type: Number, default: 0 },
});

const Post = mongoose.model("posts", postSchema);

export const validatePost = (postObject) => {
  const errorList = [];
  const allowedKeys = [
    "status",
    "tags",
    "title",
    "content",
    "created_at",
    "published_at",
    "author",
    "score",
  ];

  const validatedKeysMessage = validateAllowedFields(postObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  const {
    status,
    tags,
    title,
    content,
    created_at,
    published_at,
    author,
    score,
  } = postObject;

  // Validate status
  if (status == null) {
    errorList.push("status is a required field");
  } else {
    if (typeof status !== "string") {
      errorList.push("status must be a string");
    }
    if (!Object.values(PostStatus).includes(status)) {
      errorList.push("status must be one of: " + Object.values(PostStatus));
    }
  }

  // Validate tags
  if (tags) {
    if (!Array.isArray(tags)) {
      errorList.push("tags must be an array");
    }
    for (const tag of tags) {
      if (typeof tag !== "string") {
        errorList.push("tags must be an array of strings");
      }
    }
  }

  // Validate title
  if (title == null) {
    errorList.push("title is a required field");
  } else {
    if (typeof title !== "string") {
      errorList.push("title must be a string");
    }
    if (title.length < 1 || title.length > 100) {
      errorList.push("title must be between 1 and 100 characters");
    }
  }

  // Validate content
  if (content == null) {
    errorList.push("content is a required field");
  } else {
    if (typeof content !== "string") {
      errorList.push("content must be a string");
    }
    if (content.length < 1 || content.length > 10000) {
      errorList.push("content must be between 1 and 10000 characters");
    }
  }

  // Validate created_at
  if (created_at) {
    if (!(created_at instanceof Date)) {
      errorList.push("created_at must be a Date object");
    }
    if (created_at.getTime() > Date.now()) {
      errorList.push("created_at cannot be in the future");
    }
  }

  // Validate published_at
  if (published_at) {
    if (!(published_at instanceof Date)) {
      errorList.push("published_at must be a Date object");
    }
    if (published_at.getTime() > Date.now()) {
      errorList.push("published_at cannot be in the future");
    }
  }

  // Validate that published_at is not before created_at
  if (published_at && created_at) {
    if (published_at.getTime() < created_at.getTime()) {
      errorList.push("published_at cannot be before created_at");
    }
  }

  // Validate author
  if (author == null) {
    errorList.push("author is a required field");
  } else if (!mongoose.Types.ObjectId.isValid(author)) {
    errorList.push("author must be a valid ObjectId");
  }

  // Validate score
  if (score) {
    if (typeof score !== "number") {
      errorList.push("score must be a number");
    }
    if (score < 0) {
      errorList.push("score cannot be negative");
    }
    if (score > 100) {
      errorList.push("score cannot be greater than 100");
    }
  }

  return errorList;
};

export default Post;
