const validateLoginBody = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Invalid email format" });
  }

  if (typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ msg: "Password cannot be empty" });
  }

  next();
};

export default validateLoginBody;
