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

const sendMail = async (toEmail) => {
  try {
        const emailTemplate = fs.readFileSync(
          path.join(__dirname, "..", "views", "index.html"),
          "utf8"
        );
    await transporter.sendMail({
      from: process.env.USER_MAIL,
      to: toEmail,
      subject: "Welcome!",
      html: emailTemplate,
    });
    console.log("Mail sent successfully to", toEmail);
    return { success: true };
  } catch (error) {
    console.error("Error sending mail:", error);
    return { success: false, error };
  }
};

module.exports = {sendMail};
