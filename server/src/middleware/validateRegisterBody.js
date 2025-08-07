const validateRegisterBody = (req, res, next) => {
  const { email, firstName, lastName, password, passwordConfirmation } =
    req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  if (!firstName) {
    return res.status(400).json({ msg: "First name is required" });
  }

  if (!lastName) {
    return res.status(400).json({ msg: "Last name is required" });
  }

  if (!password) {
    return res.status(400).json({ msg: "Password is required" });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  next();
};

export default validateRegisterBody;
