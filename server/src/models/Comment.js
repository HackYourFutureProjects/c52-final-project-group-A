import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

export const CommentStatus = {
  VISIBLE: "VISIBLE",
  HIDDEN: "HIDDEN",
};

const commentSchema = new Schema({
  status: {
    type: String,
    enum: Object.values(CommentStatus),
    default: CommentStatus.VISIBLE,
  },
  created_at: { type: Date, default: Date.now },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("comments", commentSchema);

export const validateComment = (commentObject) => {
  const errorList = [];
  const allowedKeys = ["status", "created_at", "user", "post", "content"];

  const validatedKeysMessage = validateAllowedFields(
    commentObject,
    allowedKeys,
  );

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  const { status, created_at, user, post, content } = commentObject;

  // Validate status
  if (status) {
    if (typeof status !== "string") {
      errorList.push("status must be a string");
    }
    if (!Object.values(CommentStatus).includes(status)) {
      errorList.push("status must be one of: " + Object.values(CommentStatus));
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

  // Validate user
  if (commentObject.user == null) {
    errorList.push("user is a required field");
  }
  if (!mongoose.Types.ObjectId.isValid(user)) {
    errorList.push("user must be a valid ObjectId");
  }

  // Validate post
  if (commentObject.post == null) {
    errorList.push("post is a required field");
  }
  if (!mongoose.Types.ObjectId.isValid(post)) {
    errorList.push("post must be a valid ObjectId");
  }

  // Validate content
  if (commentObject.content == null) {
    errorList.push("content is a required field");
  }
  if (typeof content !== "string") {
    errorList.push("content must be a string");
  }

  return errorList;
};

export default Comment;
