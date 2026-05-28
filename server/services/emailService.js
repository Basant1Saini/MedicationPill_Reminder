import nodemailer from 'nodemailer';

// nodemailer v8 — OAuth2 transport (no deprecated username/password auth)
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

export const sendReminderEmail = async (to, medicationName, time) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Pill Reminder" <${process.env.GMAIL_USER}>`,
    to,
    subject: `💊 Time to take ${medicationName}`,
    html: `<p>It's <strong>${time}</strong> — time to take your <strong>${medicationName}</strong>.</p>`,
  });
};

export const sendRefillAlert = async (to, medicationName, stock) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Pill Reminder" <${process.env.GMAIL_USER}>`,
    to,
    subject: `⚠️ Low stock alert: ${medicationName}`,
    html: `<p>Your <strong>${medicationName}</strong> stock is low: <strong>${stock} remaining</strong>. Please refill soon.</p>`,
  });
};
