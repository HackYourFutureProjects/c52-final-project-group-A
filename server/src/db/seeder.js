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
    const userPostIds = [];

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

      userPostIds.push(savedPost._id);
    }
    if (userPostIds.length > 0) {
      user.posts.push(...userPostIds);
      await user.save();
    }
  }
  logInfo(`Created ${posts.length} posts`);

  // generating likes
  logInfo("Generating likes...");
  const numLikes = users.length * AVG_NUM_LIKES;

  // getting existing likes to avoid duplication
  const existingLikes = await Like.find({}, { user: 1, post: 1 }).lean();
  const existingLikeSet = new Set(
    existingLikes.map((like) => `${like.user}-${like.post}`),
  );

  const likes = [];
  const userLikeUpdates = new Map();

  for (let i = 0; i < numLikes; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const likeKey = `${randomUser._id}-${randomPost._id}`;

    // checking for duplicates
    if (!existingLikeSet.has(likeKey)) {
      existingLikeSet.add(likeKey);

      const like = new Like({
        user: randomUser._id,
        post: randomPost._id,
        created_at: faker.date.recent(),
      });

      likes.push(like);
      if (!userLikeUpdates.has(randomUser._id)) {
        userLikeUpdates.set(randomUser._id, []);
      }

      userLikeUpdates.get(randomUser._id).push(like);
    }
  }
  // saving likes in bulk
  let insertedLikes = [];
  if (likes.length > 0) {
    insertedLikes = await Like.insertMany(likes);
    logInfo(`Created ${insertedLikes.length} likes`);
  } else {
    logInfo("No new likes created");
  }

  // updating users with newly created likes
  const usersBulk = [];
  for (const [userId, likes] of userLikeUpdates.entries()) {
    const likeIds = likes.map((like) => like._id);
    usersBulk.push({
      updateOne: {
        filter: { _id: userId },
        update: { $push: { likes: { $each: likeIds } } },
      },
    });
  }

  if (usersBulk.length > 0) {
    await User.bulkWrite(usersBulk);
    logInfo(`Updated ${usersBulk.length} users with new likes`);
  }
  // generating follows
  logInfo("Generating follows...");
  const numFollows = users.length * AVG_NUM_FOLLOWS;
  const followSet = new Set();
  const potentialFollows = [];

  for (let i = 0; i < numFollows; i++) {
    const followerIndex = Math.floor(Math.random() * users.length);
    let followingIndex;

    // making sure users don't follow themselves
    do {
      followingIndex = Math.floor(Math.random() * users.length);
    } while (followerIndex === followingIndex);

    const follower = users[followerIndex];
    const following = users[followingIndex];

    const followKey = `${follower._id}-${following._id}`;

    if (!followSet.has(followKey)) {
      followSet.add(followKey);
      potentialFollows.push({
        follower: follower._id,
        following: following._id,
      });
    }
  }

  // pre-filtering duplicates
  const existingFollows = await Follow.find({
    $or: potentialFollows.map(({ follower, following }) => ({
      follower,
      following,
    })),
  });

  const existingFollowSet = new Set(
    existingFollows.map((follow) => `${follow.follower}-${follow.following}`),
  );

  const newFollows = potentialFollows.filter(
    ({ follower, following }) =>
      !existingFollowSet.has(`${follower}-${following}`),
  );

  // inserting new follows in bulk
  if (newFollows.length > 0) {
    await Follow.insertMany(newFollows);

    // updating user references
    for (const { follower, following } of newFollows) {
      const followerUser = users.find((user) => user._id.equals(follower));
      const followingUser = users.find((user) => user._id.equals(following));

      followerUser.following.push(following);
      followingUser.followers.push(follower);
    }

    await User.bulkWrite(
      users.map((user) => ({
        updateOne: {
          filter: { _id: user._id },
          update: {
            $set: {
              followers: user.followers,
              following: user.following,
            },
          },
        },
      })),
    );
  }

  logInfo("Follows generated");
}

seed()
  .then(() => logInfo("Database seeding completed"))
  .catch((error) => logError("Error seeding database: " + error))
  .finally(() => mongoose.connection.close());
