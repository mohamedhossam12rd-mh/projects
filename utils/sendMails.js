const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAIL,
  port: process.env.PORT_MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

const sendMail = async (toEmail, userName) => {
  try {
    await transporter.sendMail({
      from: process.env.USER_MAIL,
      to: toEmail,
      subject: "Welcome!",
      html: `<h1>Welcome ${userName}!</h1>`,
    });
    console.log("Mail sent successfully to", toEmail);
    return { success: true };
  } catch (error) {
    console.error("Error sending mail:", error);
    return { success: false, error };
  }
};

module.exports = sendMail;
