export default function verifyApiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];
  const serverKey = process.env.API_KEY;

  if (!clientKey || clientKey !== serverKey) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  next();
}
