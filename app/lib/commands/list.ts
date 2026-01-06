import { prisma } from "../prisma";
import { sendWhatsApp } from "../twilio";

interface ListRemindersResult {
  success: boolean;
  message?: string; // WhatsApp message that was sent
  error?: string; // Error message if failed
}

export async function listReminders(
  userPhone: string,
  all: boolean = false
): Promise<ListRemindersResult> {
  try {
    const now = new Date();
    const reminders = await prisma.reminder.findMany({
      where: all ? { userPhone } : { userPhone, scheduledAt: { gte: now } },
      orderBy: { scheduledAt: "asc" },
    });

    let message: string;

    if (reminders.length === 0) {
      message = "You have no reminders set.";
    } else {
      message =
        "📋 Your Reminders:\n" +
        reminders
          .map((r, i) => {
            const dateStr = r.scheduledAt.toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
            return `${i + 1}. ${r.title}, Scheduled At - ${dateStr}`;
          })
          .join("\n");
    }

    // Send WhatsApp message
    await sendWhatsApp(userPhone, message);

    return { success: true, message };
  } catch (err) {
    console.error("Error listing reminders:", err);
    return { success: false, error: "Failed to fetch reminders" };
  }
}
