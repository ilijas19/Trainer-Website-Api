const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verificationUrl = `${origin}/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Click on the following link to verify your email <a href="${verificationUrl}">Verify</a></p>`;

  await sendEmail({
    to: email,
    name,
    subject: "Email Verification",
    message,
  });
};

module.exports = sendVerificationEmail;
