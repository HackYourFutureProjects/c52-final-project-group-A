import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";
import dotenv from "dotenv";
import config from "../config.js";

dotenv.config();

const { EMAIL_VALIDATION_EXPIRATION } = config;

const PendingUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  verification_code: { type: String, required: true },
  created_at: {
    type: Date,
    default: Date.now,
    expires: EMAIL_VALIDATION_EXPIRATION,
  },
});

const PendingUser = mongoose.model("pendingUsers", PendingUserSchema);

export const validatePendingUser = (pendingUserObject) => {
  const errorList = [];
  const allowedKeys = [
    "email",
    "username",
    "first_name",
    "last_name",
    "password",
    "verification_code",
    "created_at",
  ];

  const validatedKeysMessage = validateAllowedFields(
    pendingUserObject,
    allowedKeys,
  );

  if (validatedKeysMessage.length > 0) {
    errorList.push(validatedKeysMessage);
  }

  const {
    email,
    username,
    first_name,
    last_name,
    password,
    verification_code,
    created_at,
  } = pendingUserObject;

  // Validate email
  if (email == null) {
    errorList.push("email is a required field");
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    errorList.push("email must be a valid email address");
  }

  // Validate username
  if (username == null) {
    errorList.push("username is a required field");
  } else {
    if (username.length < 6 || username.length > 32) {
      errorList.push("username must be between 6 and 32 characters");
    }
    if (!/^[a-z0-9._-]+$/.test(username)) {
      errorList.push(
        "username must contain only lowercase letters, numbers, dots, underscores, and hyphens",
      );
    }
  }

  // Validate first_name and last_name
  if (first_name == null || last_name == null) {
    errorList.push("first_name and last_name are required fields");
  } else {
    if (typeof first_name !== "string" || typeof last_name !== "string") {
      errorList.push("first_name and last_name must be a string");
    }
    if (
      !/^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/.test(first_name) ||
      !/^[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/.test(last_name)
    ) {
      errorList.push(
        "first_name and last_name must contain only letters, spaces, and apostrophes",
      );
    }
  }

  // Validate password
  if (password == null) {
    errorList.push("password is a required field");
  } else {
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

  // Validate verification_code
  if (verification_code == null) {
    errorList.push("verification_code is a required field");
  } else {
    if (typeof verification_code !== "string") {
      errorList.push("verification_code must be a string");
    }
    if (verification_code.length !== 6) {
      errorList.push("verification_code must be exactly 6 characters long");
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

  return errorList;
};

export default PendingUser;
