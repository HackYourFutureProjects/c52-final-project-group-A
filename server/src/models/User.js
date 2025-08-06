import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";

const profileSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  avatar: String,
  bio: String,
});

const userSchema = new Schema({
  admin: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: String,
  email: { type: String, required: true, unique: true },
  google_id: String,
  created_at: { type: Date, default: Date.now },
  profile: profileSchema,
  score: { type: Number, default: 0 },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "likes",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const User = mongoose.model("users", userSchema);

export const validateUser = (userObject) => {
  const errorList = [];
  const allowedKeys = [
    "admin",
    "username",
    "password",
    "email",
    "google_id",
    "created_at",
    "profile",
    "score",
    "posts",
    "likes",
    "comments",
    "following",
    "followers",
  ];

  const validatedKeysMessage = validateAllowedFields(userObject, allowedKeys);

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  if (userObject.username == null) {
    errorList.push("username is a required field");
  }

  if (userObject.email == null) {
    errorList.push("email is a required field");
  }

  if (userObject.profile) {
    if (userObject.profile.first_name == null) {
      errorList.push("profile.first_name is a required field");
    }
    if (userObject.profile.last_name == null) {
      errorList.push("profile.last_name is a required field");
    }
  } else {
    errorList.push("profile is a required field");
  }

  return errorList;
};

export default User;
