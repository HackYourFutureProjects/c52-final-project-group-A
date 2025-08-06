const validateRegisterBody = (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!firstName) {
    return res.status(400).json({ error: "First name is required" });
  }

  if (!lastName) {
    return res.status(400).json({ error: "Last name is required" });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  next();
};

export default validateRegisterBody;
