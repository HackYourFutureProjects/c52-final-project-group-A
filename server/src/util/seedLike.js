import Like from "../models/Like.js";
import { faker } from "@faker-js/faker";
import { logInfo } from "./logging.js";
import User from "../models/User.js";
import config from "../config.js";

if (config.FAKER_SEED) {
  faker.seed(config.FAKER_SEED);
}
async function seedlike(users, posts, AVG_NUM_LIKES = 5) {
  const HAPPY = config.SEED_MODE === "happy";

  // Freeze "now" for consistent timestamps during this run
  const runNow = new Date();

  // Feed window (e.g., last 28h if FEED_WINDOW_HOURS=28 in .env)
  const sinceWindow = new Date(
    runNow.getTime() - config.FEED_WINDOW_HOURS * config.MILLISECONDS_PER_HOUR,
  );

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

      // Timestamp choice:
      // - HAPPY: guaranteed recent in your feed window
      // - REALISTIC: anywhere in the past (no forced recency)
      const createdAt = HAPPY
        ? faker.date.between({ from: sinceWindow, to: runNow })
        : faker.date.past(); // <-- your requested "realistic" behavior

      const like = new Like({
        user: randomUser._id,
        post: randomPost._id,
        created_at: createdAt,
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
}

export default seedlike;
