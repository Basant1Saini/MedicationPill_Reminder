import { schedule } from 'node-cron';
import webpush from 'web-push';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';
import Medication from '../models/Medication.js';
import { sendReminderEmail, sendRefillAlert } from './emailService.js';

export const initWebPush = () => {
  if (process.env.VAPID_PUBLIC_KEY && !process.env.VAPID_PUBLIC_KEY.startsWith('<')) {
    webpush.setVapidDetails(
      `mailto:${process.env.GMAIL_USER}`,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }
};

const getDayAbbr = () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

export const startCronJobs = () => {
  // Run every minute to check due reminders
  schedule('* * * * *', async () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const today = getDayAbbr();

    const reminders = await Reminder.find({ isActive: true }).populate('medicationId');
    for (const reminder of reminders) {
      const isDueToday = reminder.days.includes('daily') || reminder.days.includes(today);
      const isDueNow = reminder.times.includes(currentTime);
      if (!isDueToday || !isDueNow) continue;

      const user = await User.findById(reminder.userId);
      if (!user) continue;

      const medName = reminder.medicationId?.name || 'medication';

      if (reminder.notifyVia.includes('push') && user.pushSubscription) {
        await webpush.sendNotification(
          user.pushSubscription,
          JSON.stringify({ title: '💊 Pill Reminder', body: `Time to take ${medName}` })
        ).catch(() => {});
      }

      if (reminder.notifyVia.includes('email')) {
        await sendReminderEmail(user.email, medName, currentTime).catch(() => {});
      }

      // Refill alert check
      const med = await Medication.findById(reminder.medicationId);
      if (med && med.stock <= med.refillAlert) {
        if (reminder.notifyVia.includes('email')) {
          await sendRefillAlert(user.email, med.name, med.stock).catch(() => {});
        }
      }
    }
  });
};
