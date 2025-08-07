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

  const validateArrayOfIds = (array, ref) => {
    if (!Array.isArray(array)) {
      errorList.push(`${ref} must be an array`);
      return;
    }
    for (const id of array) {
      if (typeof id !== "string") {
        errorList.push(`${ref} must be an array of strings`);
        return;
      }
    }
  };

  const {
    admin,
    username,
    password,
    email,
    google_id,
    created_at,
    profile,
    score,
    posts,
    likes,
    comments,
    following,
    followers,
  } = userObject;

  // Validate password or google_id is present
  if (!password && !google_id) {
    errorList.push("password or google_id is required");
  }

  // Validate admin
  if (admin) {
    if (typeof admin !== "boolean") {
      errorList.push("admin must be a boolean");
    }
  }

  // Validate username
  if (username == null) {
    errorList.push("username is a required field");
  } else {
    if (username.length < 6 || username.length > 32) {
      errorList.push("username must be between 6 and 32 characters");
    }
    if (!/^[a-z0-9]+$/.test(username)) {
      errorList.push(
        "username must contain only lowercase letters and numbers",
      );
    }
  }

  // Validate password
  if (password) {
    if (password.length < 8) {
      errorList.push("password must be at least 8 characters long");
    }
    if (password.length > 50) {
      errorList.push("password must be at most 50 characters long");
    }
    if (password.includes(" ")) {
      errorList.push("password cannot contain spaces");
    }
  }

  // Validate email
  if (email == null) {
    errorList.push("email is a required field");
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errorList.push("email must be a valid email address");
  }

  // Validate google_id
  if (google_id) {
    if (typeof google_id !== "string") {
      errorList.push("google_id must be a string");
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

  // Validate profile
  if (profile) {
    if (profile.first_name == null) {
      errorList.push("profile.first_name is a required field");
    }
    if (profile.last_name == null) {
      errorList.push("profile.last_name is a required field");
    }
  } else {
    errorList.push("profile is a required field");
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

  // Validate posts
  if (posts) {
    validateArrayOfIds(posts, "posts");
  }

  // Validate likes
  if (likes) {
    validateArrayOfIds(likes, "likes");
  }

  // Validate comments
  if (comments) {
    validateArrayOfIds(comments, "comments");
  }

  // Validate following
  if (following) {
    validateArrayOfIds(following, "following");
  }

  // Validate followers
  if (followers) {
    validateArrayOfIds(followers, "followers");
  }

  return errorList;
};

export default User;
