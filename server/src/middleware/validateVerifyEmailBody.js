const validateVerifyEmailBody = (req, res, next) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res
      .status(400)
      .json({ error: "Email and verification code are required" });
  }

  if (verificationCode.length !== 6) {
    return res
      .status(400)
      .json({ error: "Verification code must be 6 characters long" });
  }

  if (typeof verificationCode !== "string" || verificationCode.trim() === "") {
    return res.status(400).json({ error: "Invalid verification code" });
  }

  next();
};

export default validateVerifyEmailBody;
