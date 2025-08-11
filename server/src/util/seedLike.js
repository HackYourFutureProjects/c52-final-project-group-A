import Like from "../models/Like.js";
import { faker } from "@faker-js/faker";
import { logInfo } from "./logging.js";
import User from "../models/User.js";

async function seedlike(users, posts, AVG_NUM_LIKES = 5) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

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
        created_at: faker.date.between({ from: sevenDaysAgo, to: now }),
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
