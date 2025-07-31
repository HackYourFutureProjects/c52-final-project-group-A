import mongoose, { Schema } from "mongoose";
import validateAllowedFields from "../util/validateAllowedFields.js";
import dotenv from "dotenv";

dotenv.config();

const { EMAIL_VALIDATION_EXPIRATION } = process.env;
if (!EMAIL_VALIDATION_EXPIRATION) {
  throw new Error("EMAIL_VALIDATION_EXPIRATION is not defined in .env file");
}

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

  if (pendingUserObject.email == null) {
    errorList.push("email is a required field");
  }

  if (pendingUserObject.username == null) {
    errorList.push("username is a required field");
  }

  if (pendingUserObject.first_name == null) {
    errorList.push("first_name is a required field");
  }

  if (pendingUserObject.last_name == null) {
    errorList.push("last_name is a required field");
  }

  if (pendingUserObject.password == null) {
    errorList.push("password is a required field");
  }

  if (pendingUserObject.verification_code == null) {
    errorList.push("verification_code is a required field");
  }

  return errorList;
};

export default PendingUser;
