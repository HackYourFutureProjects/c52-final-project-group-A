import User from "../models/User.js";
import { logError } from "../util/logging.js";
import { Types } from "mongoose";

export const getProfile = async (req, res) => {
  const { id } = req.params;

  const ObjectId = Types.ObjectId;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      msg: "Invalid user id",
    });
  }

  try {
    const user = await User.findOne(
      { _id: id },
      { password: 0, email: 0, admin: 0 },
    ).populate("posts");

    res.status(200).json({ success: true, result: user });
  } catch (err) {
    logError(err);
    res.status(500).json({
      success: false,
      msg: "Unable to get profile, try again later",
    });
  }
};
