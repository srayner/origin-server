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

sendMail = toAddress => {
  const from = process.env.EMAIL_FROM;
  const to = toAddress;
  const mailOptions = {
    from: from,
    to: to,
    subject: "Sending Email using Node.js",
    text: "That was easy!"
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = toAddress => {
  sendMail(toAddress);
};
