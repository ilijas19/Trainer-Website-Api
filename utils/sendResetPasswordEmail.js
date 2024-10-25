const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({
  name,
  email,
  passwordResetToken,
  origin,
}) => {
  const verificationUrl = `${origin}/reset-password?token=${passwordResetToken}&email=${email}`;

  const message = `<p>Click on the following link to reset your password <a href="${verificationUrl}">Verify</a></p>`;

  await sendEmail({
    to: email,
    name,
    subject: "Password Reset",
    message,
  });
};

module.exports = sendResetPasswordEmail;
