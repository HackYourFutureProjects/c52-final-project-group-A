// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
// import jwt from "jsonwebtoken";
// import config from "../src/config.js"; // ✅ Import your config AFTER dotenv

// // Fix __dirname for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ Load environment variables from ../.env
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// // 🔍 TEST that env is loaded
// console.log("✅ process.env.JWT_SECRET =", process.env.JWT_SECRET);

// // ✅ Use a real seeded user ID from environment variable
// const seededUserId = process.env.SEEDED_USER_ID;
// if (!seededUserId) {
//   console.error("❌ SEEDED_USER_ID environment variable not set. Please set it in your .env file.");
//   process.exit(1);
// }

// // ✅ Generate JWT
// const token = jwt.sign({ _id: seededUserId }, config.JWT_SECRET, {
//   expiresIn: "7d",
// });

// // ✅ Print it out to use in Postman
// console.log("✅ JWT token:", token);
