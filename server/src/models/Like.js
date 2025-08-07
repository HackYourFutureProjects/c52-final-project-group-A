import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const likeSchema = new Schema({
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
});

const Like = mongoose.model("likes", likeSchema);

export const validateLike = (likeObject) => {
  const errorList = [];
  const allowedKeys = ["created_at", "user", "post"];

  const validatedKeysMessage = validateAllowedFields(likeObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  const { created_at, user, post } = likeObject;

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
  if (user == null) {
    errorList.push("user is a required field");
  }
  if (!mongoose.Types.ObjectId.isValid(user)) {
    errorList.push("user must be a valid ObjectId");
  }

  // Validate post
  if (post == null) {
    errorList.push("post is a required field");
  }
  if (!mongoose.Types.ObjectId.isValid(post)) {
    errorList.push("post must be a valid ObjectId");
  }

  return errorList;
};

export default Like;
