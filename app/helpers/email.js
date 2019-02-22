const nodemailer = require("nodemailer");
const emailAccount = process.env.EMAIL_ACCOUNT;
const emailPassword = process.env.EMAIL_PASSWORD;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailAccount,
    pass: emailPassword
  }
});

sendMail = (to, subject, text) => {
  const from = process.env.EMAIL_FROM;
  const mailOptions = { from, to, subject, text };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = (to, subject, text) => {
  sendMail(to, subject, text);
};
