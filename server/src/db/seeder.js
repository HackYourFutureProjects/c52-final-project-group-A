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
import seedlike from "../util/seedLike.js";
import seedComment from "../util/seedComment.js";
import seedFollow from "../util/seedFollow.js";
import config from "../config.js";

const {
  SALT_ROUNDS,
  DROP_DB,
  NUM_USERS,
  MAX_NUM_POSTS_PER_USER,
  TAGS,
  AVG_NUM_LIKES,
  AVG_NUM_COMMENTS,
  AVG_NUM_FOLLOWS,
} = config;

async function seed() {
  logInfo("Starting database seeding...");

  // connecting to db
  await dbConnect();
  logInfo("Connected to MongoDB");

  // dropping data (optional), comment out to proceed without dropping DB
  if (DROP_DB) {
    logInfo("Dropping existing data...");
    await User.deleteMany();
    await Post.deleteMany();
    await Like.deleteMany();
    await Follow.deleteMany();
    await Comment.deleteMany();
  }

  // generating users
  logInfo("Generating users...");
  const users = await seedUser(NUM_USERS, SALT_ROUNDS);

  // generating posts
  logInfo("Generating posts...");
  const posts = await seedPost(users, MAX_NUM_POSTS_PER_USER, TAGS);
  logInfo(`Created ${posts.length} posts`);

  // generating likes
  logInfo("Generating likes...");
  await seedlike(users, posts, AVG_NUM_LIKES);

  logInfo("Generating comments...");
  await seedComment(users, posts, AVG_NUM_COMMENTS);

  // generating follows
  logInfo("Generating follows...");
  await seedFollow(users, AVG_NUM_FOLLOWS);

  logInfo("Follows generated");
}

seed()
  .then(() => logInfo("Database seeding completed"))
  .catch((error) => logError("Error seeding database: " + error))
  .finally(() => mongoose.connection.close());
