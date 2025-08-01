import nodemailer from "nodemailer";
import { logError } from "./logging.js";
import config from "../config.js";

const { EMAIL, EMAIL_PASSWORD, EMAIL_PROVIDER } = config;

const transporter = nodemailer.createTransport({
  service: EMAIL_PROVIDER,
  auth: {
    user: EMAIL, // Use environment variables or a config file for security
    pass: EMAIL_PASSWORD, // Use environment variables or a config file for security
  },
});

async function sendEmail(to, code) {
  const mailOptions = {
    from: "'MySite' <example@gmail.com>",
    to,
    subject: "Email Verification",
    text: `Your verification code is: ${code}`,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    logError(`Error sending email to ${to}:`, error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export default sendEmail;
