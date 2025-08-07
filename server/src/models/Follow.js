import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const followSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

// adding compound index for the unique follower-following pairs
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model("follows", followSchema);

export const validateFollow = (followObject) => {
  const errorList = [];
  const allowedKeys = ["follower", "following"];

  const validatedKeysMessage = validateAllowedFields(followObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  const { follower, following } = followObject;

  // Validate follower and following
  if (follower === null || following === null) {
    errorList.push("follower and following are required fields");
  } else if (
    !mongoose.Types.ObjectId.isValid(follower) ||
    !mongoose.Types.ObjectId.isValid(following)
  ) {
    errorList.push("follower and following must be valid ObjectId");
  }

  // Validate the unique follower-following pairs
  if (follower === following) {
    errorList.push("follower and following cannot be the same user");
  }

  return errorList;
};

export default Follow;
