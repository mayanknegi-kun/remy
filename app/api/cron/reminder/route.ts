import { prisma } from "@/app/lib/prisma";
import { sendWhatsApp } from "@/app/lib/twilio";

export async function GET() {
  try {
    const now = new Date();

    const dueReminders = await prisma.reminder.findMany({
      where: {
        scheduledAt: { lte: now },
        sent: false,
      },
    });

    for (const reminder of dueReminders) {
      await sendWhatsApp(reminder.userPhone, `⏰ Reminder: ${reminder.title}`);

      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { sent: true },
      });
    }

    return Response.json({
      success: true,
      processed: dueReminders.length,
    });
  } catch (err) {
    console.error("Cron error:", err);
    return new Response("Cron failed", { status: 500 });
  }
}
