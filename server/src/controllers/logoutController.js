import config from "../config.js";

const { NODE_ENV } = config;

export const logoutUser = (req, res) => {
  res.clearCookie("bq_token", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "Strict",
  });

  return res.status(200).json({ message: "Logout successful" });
};
