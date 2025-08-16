import getEnvVariable from "./util/getEnvVariable.js";

const config = {
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
  // email configuration
  EMAIL_PROVIDER: getEnvVariable("EMAIL_PROVIDER", "gmail"),
  EMAIL: getEnvVariable("EMAIL", null),
  EMAIL_PASSWORD: getEnvVariable("EMAIL_PASSWORD", null),
  // Google OAuth configuration
  CLIENT_ID: getEnvVariable("CLIENT_ID", null),
};

export default config;
