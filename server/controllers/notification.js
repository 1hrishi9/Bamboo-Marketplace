const nodemailer = require('nodemailer');
// const twilio = require('twilio');

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendNotification = async (user, message) => {
  // await client.messages.create({
  //   body: message,
  //   from: process.env.TWILIO_PHONE,
  //   to: user.phone,
  // });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Order Update',
    text: message,
  });
};