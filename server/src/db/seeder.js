import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Follow from "../models/Follow.js";
import mongoose from "mongoose";
import dbConnect from "./connectDB.js";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { logInfo, logError } from "../util/logging.js";

dotenv.config();

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
if (!SALT_ROUNDS) {
  logError("No SALT_ROUNDS in .env file");
  process.exit(1);
}

// ADJUST GLOBAL VARIABLES TO YOUR NEEDS
const DROP_DB = true;
const NUM_USERS = 50;
const MAX_NUM_POSTS_PER_USER = 10;
const AVG_NUM_LIKES = 10; // average 10 likes per post
const AVG_NUM_FOLLOWS = 5; // average of 5 follows per user

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
  }

  // generating users
  logInfo("Generating users...");
  const users = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName });
    const email = username + "@gmail.com";
    const password = faker.internet.password({ length: 10 });
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({
      username: username,
      password: hashedPassword,
      email: email,
      profile: {
        first_name: firstName,
        last_name: lastName,
        avatar: faker.image.avatar(),
        bio: faker.lorem.paragraph({ min: 1, max: 5 }),
      },
    });

    const savedUser = await user.save();
    users.push(savedUser);
    if (i % 10 === 0 || i === NUM_USERS - 1)
      logInfo(`${i + 1}/${NUM_USERS} users created`);
  }

  // generating posts
  logInfo("Generating posts...");
  const posts = [];

  for (const user of users) {
    for (
      let i = 0;
      i < Math.floor(Math.random() * (MAX_NUM_POSTS_PER_USER + 1));
      i++
    ) {
      const isPublished = Math.random() > 0.2; // 80% of posts will be published

      const post = new Post({
        status: isPublished ? "PUBLISHED" : "DRAFT",
        title: faker.lorem.sentence({ min: 1, max: 8 }),
        content: faker.lorem.paragraph({ min: 1, max: 10 }),
        created_at: faker.date.past(),
        published_at: isPublished ? faker.date.recent() : null,
        author: user._id,
      });

      const savedPost = await post.save();
      posts.push(savedPost);

      // adding post reference to user
      user.posts.push(savedPost._id);
      await user.save();
    }
  }
  logInfo(`Created ${posts.length} posts`);

  // generating likes
  logInfo("Generating likes...");
  const numLikes = users.length * AVG_NUM_LIKES;
  const likes = [];

  for (let i = 0; i < numLikes; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    // avoiding duplicate likes from the same user on the same post
    const existingLike = await Like.findOne({
      user: randomUser._id,
      post: randomPost._id,
    });

    if (!existingLike) {
      const like = new Like({
        user: randomUser._id,
        post: randomPost._id,
        created_at: faker.date.recent(),
      });

      const savedLike = await like.save();
      likes.push(savedLike);

      // adding like reference to user
      randomUser.likes.push(savedLike._id);
      await randomUser.save();
    }
  }
  logInfo(`Created ${likes.length} likes`);

  // generating follows
  logInfo("Generating follows...");
  const numFollows = users.length * AVG_NUM_FOLLOWS;

  for (let i = 0; i < numFollows; i++) {
    const followerIndex = Math.floor(Math.random() * users.length);
    let followingIndex;

    // making sure users don't follow themselves
    do {
      followingIndex = Math.floor(Math.random() * users.length);
    } while (followerIndex === followingIndex);

    const follower = users[followerIndex];
    const following = users[followingIndex];

    // avoiding duplicate follows
    const existingFollow = await Follow.findOne({
      follower: follower._id,
      following: following._id,
    });

    if (!existingFollow) {
      const follow = new Follow({
        follower: follower._id,
        following: following._id,
      });

      await follow.save();

      // updating user references
      follower.following.push(following._id);
      following.followers.push(follower._id);

      await follower.save();
      await following.save();
    }
  }
  logInfo("Follows generated");
}

seed()
  .then(() => logInfo("Database seeding completed"))
  .catch((error) => logInfo("Error seeding database: " + error))
  .finally(() => mongoose.connection.close());
