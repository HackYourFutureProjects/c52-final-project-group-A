import Follow from "../models/Follow.js";
import User from "../models/User.js";

async function seedFollow(users, AVG_NUM_FOLLOWS = 5) {
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
}

export default seedFollow;
