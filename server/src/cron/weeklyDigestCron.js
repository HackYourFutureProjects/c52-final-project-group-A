import cron from "node-cron";
import { generateWeeklyDigest } from "../services/weeklyDigest.js";
import { makeDigestHtml } from "../util/makeDigestHtml.js";
import { sendWeeklyEmail } from "../util/sendWeeklyEmail.js";
import config from "../config.js";

const { IS_TEST_MODE, TEST_EMAIL } = config;

// Sleep function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// cron.schedule("0 10 * * 5", async () => {          //every Friday at 10:00 AM (server time).
cron.schedule("*/2 * * * *", async () => {
  //will run the task every 2nd minute.
  try {
    const digests = await generateWeeklyDigest();
    const maxEmailsPerRun = 10;
    let sentCount = 0;

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
      }
    } else {
      // PROD MODE
      for (const digest of digests) {
        if (sentCount >= maxEmailsPerRun) {
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
    }
  } catch (e) {
    console.error("Weekly digest cron error:", e);
  }
});
