import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config.js";

import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import searchRouter from "./routes/search.js";
import profileRouter from "./routes/profile.js";
import exploreRouter from "./routes/explore.js";
import followingRouter from "./routes/following.js";

const app = express();

// --- CORS ДОЛЖЕН БЫТЬ ПЕРВЫМ ---
const origins = config.CORS_ORIGINS.split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || origins.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin ${origin} не разрешён`));
  },
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: config.CORS_CREDENTIALS === "true",
}));

app.options("*", cors());
// ---------------------------------

app.use(cookieParser());
app.use(express.json());

// Роуты
app.use("/api/post", postRouter);
app.use("/api/weekly-digest", weeklyDigestRouter);
app.use("/api/feed", feedRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/search", searchRouter);
app.use("/api/profile", profileRouter);
app.use("/api/following", followingRouter);
app.use("/api/explore", exploreRouter);

export default app;
