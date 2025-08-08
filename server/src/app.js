import express from "express";
import cookieParser from "cookie-parser";
import weeklyDigestRouter from "./routes/weeklyDigest.js";
import postRouter from "./routes/post.js";
import feedRouter from "./routes/feed.js";
import registerRouter from "./routes/register.js";
import loginRouter from "./routes/login.js";
import searchRouter from "./routes/search.js";
import getUserRoute from "./routes/getUser.js";

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

// Post routes
app.use("/api/post", postRouter);
//
app.use("/api/weekly-digest", weeklyDigestRouter);
//
app.use("/api/feed", feedRouter);

app.use("/api/register", registerRouter);

app.use("/api/login", loginRouter);

app.use("/api/search", searchRouter);

app.use("/api/user", getUserRoute);

export default app;
