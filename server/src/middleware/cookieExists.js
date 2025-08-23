export function cookieExists(req, res, next) {
  const { bq_token } = req.cookies;
  if (!bq_token) {
    return res.json({
      success: true,
      msg: "Token not found",
    });
  }
  next();
}
