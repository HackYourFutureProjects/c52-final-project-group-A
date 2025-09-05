import cron from "node-cron";
import { generateWeeklyDigest } from "../services/weeklyDigest.js";
import { makeDigestHtml } from "../util/makeDigestHtml.js";
import { sendWeeklyEmail } from "../util/sendWeeklyEmail.js";
import config from "../config.js";

const { IS_TEST_MODE, TEST_EMAIL } = config;
console.log(">>> CRON FILE LOADED", new Date());

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// cron.schedule("0 10 * * 5", async () => {          //every Friday at 10:00 AM (server time).
cron.schedule("*/2 * * * *", async () => {
  //will run the task every 2nd minute.
  console.log(">>> CRON TASK TRIGGERED", new Date());
  try {
    const digests = await generateWeeklyDigest();
    const maxEmailsPerRun = 10;
    let sentCount = 0;

    console.log(
      "IS_TEST_MODE:",
      IS_TEST_MODE,
      "typeof:",
      typeof IS_TEST_MODE,
      "TEST_EMAIL:",
      TEST_EMAIL,
    );

    if (IS_TEST_MODE === "true") {
      // TEST MODE
      if (digests.length > 0) {
        const digest = digests[0];
        const html = makeDigestHtml(digest.topPosts);
        const subject = "Your Weekly Digest — TEST";

        await sendWeeklyEmail({
          to: TEST_EMAIL,
          subject,
          text: "Test: check out the top posts of the week on our website.",
          html,
        });
        console.log("Test digest sent to", TEST_EMAIL);
      }
    } else {
      // PROD MODE
      for (const digest of digests) {
        if (sentCount >= maxEmailsPerRun) {
          console.log("Antiflood: Email send limit reached for this run.");
          break;
        }
        const html = makeDigestHtml(digest.topPosts);
        const subject = "Your Weekly Digest — Top 5 Posts";

        await sendWeeklyEmail({
          to: digest.email,
          subject,
          text: "Check out the top posts of the week on our website.",
          html,
        });
        sentCount++;
        await sleep(10000);
      }
      console.log("Weekly digest sent to all users!");
    }
  } catch (e) {
    console.error("Weekly digest cron error:", e);
  }
});
