import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import commentsRouter from "./routes/comments.js";
import loginRouter from "./routes/login.js";

const app = express();

// ---- CORS (HTTP) — ДОЛЖЕН быть до любых роутов ----
const devOrigins = ["http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  process.env.FRONTEND_URL,
  ...devOrigins,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Исправлено
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ---- Парсеры (изменён порядок) ----
app.use(express.json());
app.use(cookieParser());

// ---- Роуты ----
app.use("/api/post", postRouter);
app.use("/api/weekly-digest", weeklyDigestRouter);
app.use("/api/feed", feedRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api", commentsRouter);

export default app;
