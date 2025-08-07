import express from "express";
import cookieParser from "cookie-parser";
import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import cors from "cors";
import config from "./config.js";

// Create an express server
const app = express();

// CORS
if (config.NODE_ENV === "production") {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : [];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );
} else {
  // For development
  app.use(cors());
}

// Use cookie parser middleware to handle cookies
app.use(cookieParser());

// Tell express to use the json middleware
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
