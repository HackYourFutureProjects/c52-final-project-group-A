import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const likeSchema = new Schema({
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
});

const Like = mongoose.model("likes", likeSchema);

export const validateLike = (likeObject) => {
  const errorList = [];
  const allowedKeys = ["created_at", "user", "post"];

  const validatedKeysMessage = validateAllowedFields(likeObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (likeObject.user == null) {
    errorList.push("user is a required field");
  }

  if (likeObject.post == null) {
    errorList.push("post is a required field");
  }

  return errorList;
};

export default Like;
