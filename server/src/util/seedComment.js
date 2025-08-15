import Comment from "../models/Comment.js";
import { faker } from "@faker-js/faker";
import { logInfo } from "./logging.js";
import User from "../models/User.js";

async function seedComment(users, posts, avgComments = 3) {
  const numComments = posts.length * avgComments;

  const comments = [];
  const userCommentUpdates = new Map();

  for (let i = 0; i < numComments; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];

    const comment = new Comment({
      created_at: faker.date.recent(),
      user: randomUser._id,
      post: randomPost._id,
      content: faker.lorem.paragraph({ min: 1, max: 3 }),
    });

    comments.push(comment);

    if (!userCommentUpdates.has(randomUser._id)) {
      userCommentUpdates.set(randomUser._id, []);
    }

    userCommentUpdates.get(randomUser._id).push(comment);
  }

  // saving comments in bulk
  let insertedComments = [];
  if (comments.length > 0) {
    insertedComments = await Comment.insertMany(comments);
    logInfo(`Created ${insertedComments.length} comments`);
  } else {
    logInfo("No new comments created");
  }

  // updating users with newly created comments
  const usersCommentsBulk = [];
  for (const [userId, comments] of userCommentUpdates.entries()) {
    const commentIds = comments.map((comment) => comment._id);
    usersCommentsBulk.push({
      updateOne: {
        filter: { _id: userId },
        update: { $push: { comments: { $each: commentIds } } },
      },
    });
  }

  if (usersCommentsBulk.length > 0) {
    await User.bulkWrite(usersCommentsBulk);
    logInfo(`Updated ${usersCommentsBulk.length} users with new comments`);
  }
}

export default seedComment;
