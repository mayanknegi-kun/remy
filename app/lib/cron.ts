// lib/cron.ts
import { prisma } from "./prisma";
import { sendWhatsApp } from "./twilio";

/**
 * Poll Neon DB every minute for due reminders.
 * This is safe for production and survives restarts.
 */
export async function startReminderCron() {
  setInterval(async () => {
    try {
      const now = new Date();

      // Fetch due reminders that haven't been sent
      const dueReminders = await prisma.reminder.findMany({
        where: { scheduledAt: { lte: now }, sent: false },
      });
      console.log(
        dueReminders,
        `Found ${dueReminders.length} due reminders at ${now}`
      );
      for (const reminder of dueReminders) {
        try {
          // Send WhatsApp
          await sendWhatsApp(
            reminder.userPhone,
            `⏰ Reminder: ${reminder.title}`
          );

          // Mark as sent
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { sent: true },
          });

          console.log(
            `Reminder sent: ${reminder.title} to ${reminder.userPhone}`
          );
        } catch (err) {
          console.error(`Failed to send reminder: ${reminder.title}`, err);

          // Increment attempts for retry logic
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { attempts: reminder.attempts + 1 },
          });
        }
      }
    } catch (err) {
      console.error("Error in reminder cron:", err);
    }
  }, 60 * 1000); // run every minute
}
