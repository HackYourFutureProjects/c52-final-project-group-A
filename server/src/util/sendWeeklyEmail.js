import nodemailer from "nodemailer";
import { logError } from "./logging.js";
import config from "../config.js";

const { EMAIL, EMAIL_PASSWORD, EMAIL_PROVIDER } = config;

const transporter = nodemailer.createTransport({
  service: EMAIL_PROVIDER,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

async function sendWeeklyEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: `'MySite' <${EMAIL}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    logError(`Error sending weekly email to ${to}:`, error);
    throw error;
  }
}

export { sendWeeklyEmail };
