import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const CommentStatus = {
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
    ref: "User",
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
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

  if (commentObject.user == null) {
    errorList.push("user is a required field");
  }

  if (commentObject.post == null) {
    errorList.push("post is a required field");
  }

  if (commentObject.content == null) {
    errorList.push("content is a required field");
  }

  return errorList;
};

export default Comment;
