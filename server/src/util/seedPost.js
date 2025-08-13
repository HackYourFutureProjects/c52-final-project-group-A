import Post from "../models/Post.js";
import { faker } from "@faker-js/faker";
import config from "../config.js";

if (config.FAKER_SEED) {
  faker.seed(config.FAKER_SEED);
}

async function seedPost(users, MAX_NUM_POSTS_PER_USER, TAGS) {
  const posts = [];

  const HAPPY = config.SEED_MODE === "happy";

  for (const user of users) {
    const userPostIds = [];

    for (
      let i = 0;
      i < Math.floor(Math.random() * (MAX_NUM_POSTS_PER_USER + 1));
      i++
    ) {
      const isPublished = Math.random() > 0.2; // 80% of posts will be published
      const score = Math.floor(Math.random() * 100 + 1);
      const now = new Date();
      // Feed window (e.g., last 28h or whatever you set in FEED_WINDOW_HOURS)
      const sinceWindow = new Date(
        now.getTime() - config.FEED_WINDOW_HOURS * config.MILLISECONDS_PER_HOUR,
      );

      // Pick timestamps based on mode
      // Choose createdAt based on mode
      let createdAt;
      if (HAPPY) {
        createdAt = faker.date.between({ from: sinceWindow, to: now }); // recent
      } else {
        createdAt = faker.date.past(); // anywhere in the past
      }

      // Always ensure published_at >= created_at (no matter the mode)
      const publishedAt = isPublished
        ? faker.date.between({ from: createdAt, to: now })
        : null;

      const post = new Post({
        status: isPublished ? "PUBLISHED" : "DRAFT",
        tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 3 }),
        title: faker.lorem.sentence({ min: 1, max: 8 }),
        content: faker.lorem.paragraph({ min: 1, max: 10 }),
        created_at: createdAt,
        published_at: publishedAt,
        author: user._id,
        score: score,
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

  return posts;
}

export default seedPost;
