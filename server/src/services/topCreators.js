import Post from "../models/Post.js";
import config from "../config.js";
const { LIKE_WEIGHT, FOLLOWER_WEIGHT, POST_WEIGHT } = config;

export async function getTopCreators({ windowHours = 168, limit = 4 } = {}) {
  const since = new Date(Date.now() - windowHours * 3600 * 1000);

  const creators = await Post.aggregate([
    // Stage 1: Filter for posts within the specified time window
    { $match: { published_at: { $gte: since } } },

    // Stage 2: Group by author to count their recent posts
    {
      $group: {
        _id: "$author",
        postCount: { $sum: 1 },
      },
    },

    // Stage 3: Lookup all posts by the author to get total likes
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
        as: "allPosts",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "allPosts._id",
        foreignField: "post",
        as: "likes",
      },
    },

    // Stage 4: Lookup followers for the author
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },

    // Stage 5: Calculate counts and the final score
    {
      $addFields: {
        likeCount: { $size: "$likes" },
        followerCount: { $size: "$followers" },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$postCount", POST_WEIGHT] },
            { $multiply: ["$likeCount", LIKE_WEIGHT] },
            { $multiply: ["$followerCount", FOLLOWER_WEIGHT] },
          ],
        },
      },
    },

    // Stage 6: Sort by score and limit the results
    { $sort: { score: -1 } },
    { $limit: limit },

    // Stage 7: Join with the users collection to get profile information
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "authorInfo",
      },
    },

    // Stage 8: Deconstruct the authorInfo array to a single object
    { $unwind: "$authorInfo" },

    // Stage 9: Project the final desired fields for the frontend
    {
      $project: {
        _id: "$_id",
        username: "$authorInfo.username",
        fullName: {
          $concat: [
            "$authorInfo.profile.first_name",
            " ",
            "$authorInfo.profile.last_name",
          ],
        },
        avatar: "$authorInfo.profile.avatar",
      },
    },
  ]);

  return creators;
}
