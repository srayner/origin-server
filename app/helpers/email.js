const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD
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
