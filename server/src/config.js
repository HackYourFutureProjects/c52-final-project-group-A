import getEnvVariable from "./util/getEnvVariable.js";

const config = {
  // node env production | development
  NODE_ENV: getEnvVariable("NODE_ENV", "development"),
  // server configuration
  SALT_ROUNDS: getEnvVariable("SALT_ROUNDS", 10, Number),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  MONGODB_URL: getEnvVariable("MONGODB_URL"),
  PORT: getEnvVariable("PORT", 3000, Number),
  // feed logic
  MAX_LIKED_POSTS_LIMIT: getEnvVariable("MAX_LIKED_POSTS_LIMIT", 1000, Number),
  // database seeding configuration
  DROP_DB: getEnvVariable("DROP_DB", false, (val) => val === "true"),
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
  EMAIL: getEnvVariable("EMAIL"),
  EMAIL_PASSWORD: getEnvVariable("EMAIL_PASSWORD"),
  // Google OAuth configuration
  CLIENT_ID: getEnvVariable("CLIENT_ID"),
};

export default config;
