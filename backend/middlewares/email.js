const nodemailer = require("nodemailer");

const emailMiddleware = async (req, res, next) => {
  const mailOptions = req.mailOptions;
  if (!mailOptions) {
    return res.status(400).json({ message: "Email Details are not provided" });
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
    next();
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error Sending Email" });
  }
};

module.exports = emailMiddleware;
