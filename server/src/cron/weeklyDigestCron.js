import cron from "node-cron";
import { generateWeeklyDigest } from "../services/weeklyDigest.js";
import { makeDigestHtml } from "../util/makeDigestHtml.js";
import { sendWeeklyEmail } from "../util/sendWeeklyEmail.js";

const testEmail = "oleksandrstarshynov@gmail.com"; // test email

// cron.schedule("0 10 * * 5", async () => {          //every Friday at 10:00 AM (server time).
cron.schedule("*/2 * * * *", async () => {
  //will run the task every 2nd minute.
  try {
    const digests = await generateWeeklyDigest();

    for (const digest of digests) {
      const html = makeDigestHtml(digest.topPosts);
      const subject = "Your Weekly Digest — Top 5 Posts";

      await sendWeeklyEmail({
        // to: digest.email,
        to: testEmail, // test email
        subject,
        text: "Check out the top posts of the week on our website.",
        html,
      });
    }

    console.log("Weekly digest sent successfully!");
  } catch (e) {
    console.error("Weekly digest cron error:", e);
  }
});
