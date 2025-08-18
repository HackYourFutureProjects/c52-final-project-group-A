import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { logError, logInfo } from "./logging.js";

async function readlineHelper() {
  const rl = readline.createInterface({ input, output });
  let dropCreateAdmin = false;
  let happyPath = false;

  try {
    const seed = await rl.question("Do you want to seed the database? (y/n) ");
    if (seed.toLowerCase() !== "y" && seed.toLowerCase() !== "yes") {
      logInfo("Seeding cancelled");
      rl.close();
      return null;
    }

    const drop = await rl.question("Should the DB be dropped? (y/n) ");
    if (drop.toLowerCase() === "y" || drop.toLowerCase() === "yes") {
      dropCreateAdmin = true;
    }

    const followHappyPath = await rl.question(
      "Should the database be seeded with a happy path? (y/n) ",
    );
    if (
      followHappyPath.toLowerCase() === "y" ||
      followHappyPath.toLowerCase() === "yes"
    ) {
      happyPath = true;
    }

    const askCount = async (msg, min, max) => {
      const answer = await rl.question(`${msg} [${min}-${max}] `);
      const num = parseInt(answer);

      if (isNaN(num) || num < min || num > max) {
        logError(
          `Invalid input. Please enter a number between ${min} and ${max}.`,
        );
        return askCount(msg, min, max);
      }
      return num;
    };

    const numUsers = await askCount(
      "How many users should be created?",
      1,
      1000,
    );
    const maxPostsPerUser = await askCount(
      "How many posts per user? [recommended: 10]",
      1,
      100,
    );
    const avgLikes = await askCount(
      "How many average likes per user? [recommended: 5]",
      1,
      50,
    );
    const avgComments = await askCount(
      "How many average comments per post? [recommended: 3]",
      1,
      50,
    );
    const avgFollows = await askCount(
      "How many average follows per user? [recommended: 5]",
      1,
      50,
    );
    return {
      dropCreateAdmin,
      happyPath,
      numUsers,
      maxPostsPerUser,
      avgLikes,
      avgComments,
      avgFollows,
    };
  } catch (error) {
    logError("Error seeding database: " + error);
  } finally {
    rl.close();
  }
}

export default readlineHelper;
