import readline from "node:readline";
import { logError, logInfo } from "./logging.js";

async function readlineHelper() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let dropCreateAdmin = false;
  let happyPath = false;

  try {
    const seed = await new Promise((resolve) => {
      rl.question(
        "Are you sure you want to seed the database? (y/n) ",
        resolve,
      );
    });
    if (seed.toLowerCase() !== "y" && seed.toLowerCase() !== "yes") {
      logInfo("Seeding cancelled");
      return rl.close();
    }

    const drop = await new Promise((resolve) => {
      rl.question("Should the DB be dropped? (y/n) ", resolve);
    });
    if (drop.toLowerCase() === "y" || drop.toLowerCase() === "yes") {
      dropCreateAdmin = true;
    }

    const followHappyPath = await new Promise((resolve) => {
      rl.question(
        "Should the database be seeded with a happy path? (y/n) ",
        resolve,
      );
    });
    if (
      followHappyPath.toLowerCase() === "y" ||
      followHappyPath.toLowerCase() === "yes"
    ) {
      happyPath = true;
    }

    const askCount = async (rl, msg, min, max) => {
      return new Promise((resolve) => {
        rl.question(`${msg} [${min}-${max}] `, (answer) => {
          if (
            isNaN(parseInt(answer)) ||
            parseInt(answer) < min ||
            parseInt(answer) > max
          ) {
            logError(
              `Invalid input. Please enter a number between ${min} and ${max}.`,
            );
            resolve(askCount(rl, msg, min, max));
          } else {
            resolve(parseInt(answer));
          }
        });
      });
    };

    const numUsers = await askCount(
      rl,
      "How many users should be created?",
      1,
      1000,
    );
    const maxPostsPerUser = await askCount(
      rl,
      "How many posts per user? [recommended: 10]",
      1,
      100,
    );
    const avgLikes = await askCount(
      rl,
      "How many average likes per user? [recommended: 5]",
      1,
      50,
    );
    const avgComments = await askCount(
      rl,
      "How many average comments per post? [recommended: 3]",
      1,
      50,
    );
    const avgFollows = await askCount(
      rl,
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
