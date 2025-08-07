const validateVerifyEmailBody = (req, res, next) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res
      .status(400)
      .json({ msg: "Email and verification code are required" });
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
