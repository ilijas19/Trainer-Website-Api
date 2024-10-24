const sgMail = require("@sendgrid/mail");
const sendEmail = async ({ to, name, subject, message }) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to,
      from: "ilijagocic19@gmail.com",
      subject,
      html: `<h4>Hello ${name}</h4>${message}`,
    };
    const mail = await sgMail.send(msg);
    if (mail) {
      console.log("Mail sent");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
