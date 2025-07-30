import nodemailer from "nodemailer";
import OUR_EMAIL from "../config/emailConfig.js";
import OUR_APP_PASSWORD from "../config/appPasswordConfig.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: OUR_EMAIL, // Use environment variables or a config file for security
    pass: OUR_APP_PASSWORD, // Use environment variables or a config file for security
  },
});

async function sendEmail(to, code) {
  const mailOptions = {
    from: "'MySite' <example@gmail.com>",
    to,
    subject: "Email Verification",
    text: `Your verification code is: ${code}`,
  };

  return transporter.sendMail(mailOptions);
}

export default sendEmail;
