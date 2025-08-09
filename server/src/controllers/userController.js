export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { _id, username, email, profile } = req.user;
  return res.status(200).json({ _id, username, email, profile });
};
