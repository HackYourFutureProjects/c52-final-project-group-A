import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import commentsRouter from "./routes/comments.js";
import loginRouter from "./routes/login.js";

// Create an express server
const app = express();

// Enable CORS only in development
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
}

// Use cookie parser middleware to handle cookies
app.use(cookieParser());


// Tell express to use the json middleware
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on production we want to separate the API endpoints.
 */

// Post routes
app.use("/api/post", postRouter);
app.use("/api/weekly-digest", weeklyDigestRouter);
app.use("/api/feed", feedRouter);
app.use("/api/register", registerRouter);
app.use("/api", commentsRouter); // For comment endpoints

app.use("/api/login", loginRouter);

export default app;
