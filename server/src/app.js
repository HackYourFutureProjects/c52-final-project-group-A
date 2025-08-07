import express from "express";
import cookieParser from "cookie-parser";
import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import cors from "cors";
import config from "./config.js";

const app = express();

// CORS
app.use(
  cors({
    origin:
      config.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN?.split(",") || []
        : true,
    credentials: true,
  }),
);

// CORS и другие middleware
app.use(cookieParser());
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */

// Post routes
app.use("/api/post", postRouter);

//
app.use("/api/weekly-digest", weeklyDigestRouter);
//
app.use("/api/feed", feedRouter);

app.use("/api/register", registerRouter);

app.use("/api/login", loginRouter);

export default app;
