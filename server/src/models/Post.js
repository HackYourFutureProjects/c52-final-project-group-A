import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const PostStatus = {
  PUBLISHED: "PUBLISHED",
  DRAFT: "DRAFT",
};

const postSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(PostStatus),
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  published_at: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = mongoose.model("posts", postSchema);

export const validatePost = (postObject) => {
  const errorList = [];
  const allowedKeys = [
    "status",
    "title",
    "content",
    "created_at",
    "published_at",
    "author",
  ];

  const validatedKeysMessage = validateAllowedFields(postObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (postObject.status == null) {
    errorList.push("status is a required field");
  }

  if (postObject.title == null) {
    errorList.push("title is a required field");
  }

  if (postObject.author == null) {
    errorList.push("author is a required field");
  }

  return errorList;
};

export default Post;
