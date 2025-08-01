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

  if (followObject.follower == null) {
    errorList.push("follower is a required field");
  }

  if (followObject.following == null) {
    errorList.push("following is a required field");
  }

  if (followObject.follower === followObject.following) {
    errorList.push("follower and following cannot be the same user");
  }

  return errorList;
};

export default Follow;
