import express from "express";
import digestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";

// Create an express server
const app = express();

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
app.use("/api/users", digestRouter);
//
app.use("/api/feed", feedRouter);

export default app;
