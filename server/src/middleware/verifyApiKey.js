import { logError } from "../util/logging";

export default function verifyApiKey(req, res, next) {
  const clientKey = req.headers["x-api-key"];
  const serverKey = process.env.API_KEY;
  if (!serverKey) {
    logError(
      "Server configuration error: API_KEY environment variable is not defined.",
    );
    return res
      .status(500)
      .json({ error: "Server configuration error: API_KEY is not set." });
  }

  if (!clientKey || clientKey !== serverKey) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  next();
}
