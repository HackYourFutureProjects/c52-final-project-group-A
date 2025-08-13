const validateVerifyEmailBody = (req, res, next) => {
  const { verificationCode } = req.body;

  if (!verificationCode) {
    return res.status(400).json({ msg: "Verification code is required" });
  }

  if (typeof verificationCode !== "string" || verificationCode.trim() === "") {
    return res.status(400).json({ msg: "Invalid verification code" });
  }

  if (verificationCode.length !== 6) {
    return res
      .status(400)
      .json({ msg: "Verification code must be 6 characters long" });
  }

  next();
};

export default validateVerifyEmailBody;
