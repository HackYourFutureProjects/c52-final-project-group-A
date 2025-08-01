import Post from "../models/Post.js";
import { faker } from "@faker-js/faker";

async function seedPost(users, MAX_NUM_POSTS_PER_USER, TAGS) {
  const posts = [];

  for (const user of users) {
    const userPostIds = [];

    for (
      let i = 0;
      i < Math.floor(Math.random() * (MAX_NUM_POSTS_PER_USER + 1));
      i++
    ) {
      const isPublished = Math.random() > 0.2; // 80% of posts will be published
      const score = Math.floor(Math.random() * 100 + 1);

      const post = new Post({
        status: isPublished ? "PUBLISHED" : "DRAFT",
        tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 3 }),
        title: faker.lorem.sentence({ min: 1, max: 8 }),
        content: faker.lorem.paragraph({ min: 1, max: 10 }),
        created_at: faker.date.past(),
        published_at: isPublished ? faker.date.recent() : null,
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
