import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import Comment from "../models/Comment.js";
import mongoose from "mongoose";
import dbConnect from "./connectDB.js";
import { logInfo, logError } from "../util/logging.js";
import seedUser from "../util/seedUser.js";
import seedPost from "../util/seedPost.js";
import seedLike from "../util/seedLike.js";
import seedComment from "../util/seedComment.js";
import seedFollow from "../util/seedFollow.js";
import config from "../config.js";
import readlineHelper from "../util/readlineHelper.js";

const { SALT_ROUNDS, TAGS } = config;

async function seed() {
  try {
    const userInput = await readlineHelper();
    if (!userInput) {
      return;
    }

    const {
      dropCreateAdmin,
      happyPath,
      numUsers,
      maxPostsPerUser,
      avgLikes,
      avgComments,
      avgFollows,
    } = userInput;

    logInfo("Starting database seeding...");

    // connecting to db
    await dbConnect();
    logInfo("Connected to MongoDB");

    // dropping data (optional), comment out to proceed without dropping DB
    if (dropCreateAdmin) {
      logInfo("Dropping existing data...");
      await User.deleteMany();
      await Post.deleteMany();
      await Like.deleteMany();
      await Follow.deleteMany();
      await Comment.deleteMany();
    }

    // generating users
    logInfo("Generating users...");
    const users = await seedUser(numUsers, dropCreateAdmin, SALT_ROUNDS);

    // generating posts
    logInfo("Generating posts...");
    const posts = await seedPost(users, maxPostsPerUser, TAGS, happyPath);
    logInfo(`Created ${posts.length} posts`);

    // generating likes
    logInfo("Generating likes...");
    await seedLike(users, posts, avgLikes, happyPath);

    logInfo("Generating comments...");
    await seedComment(users, posts, avgComments);

    // generating follows
    logInfo("Generating follows...");
    await seedFollow(users, avgFollows);

    logInfo("Follows generated");
  } catch (error) {
    logError("Error seeding database: " + error);
  } finally {
    await mongoose.connection.close();
  }
}

seed();
