import express from "express";
import cookieParser from "cookie-parser";
import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import searchRouter from "./routes/search.js";
import profileRouter from "./routes/profile.js";
import exploreRouter from "./routes/explore.js";

// Create an express server
const app = express();

// Use cookie parser middleware to handle cookies
app.use(cookieParser());

// Tell express to use the json middleware
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */

app.use("/api/post", postRouter);
app.use("/api/weekly-digest", weeklyDigestRouter);
app.use("/api/feed", feedRouter);
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/search", searchRouter);
app.use("/api/profile", profileRouter);
app.use("/api/explore", exploreRouter);

export default app;
