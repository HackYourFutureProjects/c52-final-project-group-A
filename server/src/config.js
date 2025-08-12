import getEnvVariable from "./util/getEnvVariable.js";

const config = {
  SEED_MODE: getEnvVariable("SEED_MODE", "realistic"), // <-- default to realistic
  FAKER_SEED: getEnvVariable("FAKER_SEED", null, Number),
  // Feed personalization config
  FEED_WINDOW_HOURS: getEnvVariable("FEED_WINDOW_HOURS", 168, Number),
  LIKE_WEIGHT: getEnvVariable("LIKE_WEIGHT", 2, Number),
  FOLLOWER_WEIGHT: getEnvVariable("FOLLOWER_WEIGHT", 3, Number),
  POST_WEIGHT: getEnvVariable("POST_WEIGHT", 1, Number),
  // Time constant
  MILLISECONDS_PER_HOUR: getEnvVariable(
    "MILLISECONDS_PER_HOUR",
    3600000,
    Number,
  ),

  // node env production | development
  NODE_ENV: getEnvVariable("NODE_ENV", "development"),
  // server configuration
  SALT_ROUNDS: getEnvVariable("SALT_ROUNDS", 10, Number),
  JWT_SECRET: getEnvVariable("JWT_SECRET", null),
  MONGODB_URL: getEnvVariable("MONGODB_URL", null),
  PORT: getEnvVariable("PORT", 3000, Number),
  // feed logic
  MAX_LIKED_POSTS_LIMIT: getEnvVariable("MAX_LIKED_POSTS_LIMIT", 1000, Number),
  // database seeding configuration
  DROP_DB: getEnvVariable("DROP_DB", false, (val) => val === "true"),
  CREATE_ADMIN: getEnvVariable("CREATE_ADMIN", false, (val) => val === "true"),
  NUM_USERS: getEnvVariable("NUM_USERS", 50, Number),
  MAX_NUM_POSTS_PER_USER: getEnvVariable("MAX_NUM_POSTS_PER_USER", 10, Number),
  AVG_NUM_LIKES: getEnvVariable("AVG_NUM_LIKES", 5, Number),
  AVG_NUM_COMMENTS: getEnvVariable("AVG_NUM_COMMENTS", 3, Number),
  AVG_NUM_FOLLOWS: getEnvVariable("AVG_NUM_FOLLOWS", 5, Number),
  TAGS: [
    "technology",
    "education",
    "health",
    "finance",
    "sports",
    "travel",
    "food",
    "fashion",
    "art",
    "science",
    "business",
    "music",
    "environment",
    "photography",
    "lifestyle",
    "politics",
    "culture",
    "history",
    "movies",
    "literature",
  ],
  EMAIL_VALIDATION_EXPIRATION: getEnvVariable(
    "EMAIL_VALIDATION_EXPIRATION",
    600,
    Number,
  ),
  // email configuration
  EMAIL_PROVIDER: getEnvVariable("EMAIL_PROVIDER", "gmail"),
  EMAIL: getEnvVariable("EMAIL", null),
  EMAIL_PASSWORD: getEnvVariable("EMAIL_PASSWORD", null),
  // Google OAuth configuration
  CLIENT_ID: getEnvVariable("CLIENT_ID", null),
};

export default config;
