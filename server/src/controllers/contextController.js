import { Types } from "mongoose";
import User from "../models/User.js";
import { logError } from "../util/logging.js";

export const updContext = async (req, res) => {
  const { userId } = req.tokenData;
  if (!userId) {
    return res.status(400).json({
      success: false,
      msg: "User ID was not provided in the token",
    });
  }

  const ObjectId = Types.ObjectId;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid user ID format",
    });
  }

  try {
    const user = await User.findById(new ObjectId(userId));
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    res
      .status(200)
      .json({ success: true, userId: user._id, username: user.username });
  } catch (err) {
    logError(err);
    return res.status(500).json({
      success: false,
      msg: err.message || "Unable to update context, try again later",
    });
  }
};
