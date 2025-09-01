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
    from: `"BQ APP" <${EMAIL}>`,
    to,
    subject: "Email Verification",
    text: `Your verification code is: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #fe4a22;">Email Verification</h2>
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #0d0d0d; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `,
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    logError(`Error sending email to ${to}:`, error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

export default sendEmail;
