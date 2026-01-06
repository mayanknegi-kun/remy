import { prisma } from "@/app/lib/prisma";
import { sendWhatsApp } from "@/app/lib/twilio";

export async function GET(req: Request) {
  console.log("🔔 Cron triggered");

  const auth = req.headers.get("authorization");
  console.log("Auth header:", auth);

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("❌ Unauthorized cron");
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const now = new Date();
    console.log("⏰ Now:", now.toISOString());
    const dueReminders = await prisma.reminder.findMany({
      where: {
        scheduledAt: { lte: now },
        sent: false,
      },
    });
    console.log("📋 Due reminders:", dueReminders.length);
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
