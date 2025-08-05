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

// // ✅ Use a real seeded user ID
// const seededUserId = "688ca9becc799a751a915894"; // Replace with actual ID from DB

// // ✅ Generate JWT
// const token = jwt.sign({ _id: seededUserId }, config.JWT_SECRET, {
//   expiresIn: "7d",
// });

// // ✅ Print it out to use in Postman
// console.log("✅ JWT token:", token);
