import dayjs from "dayjs";
import { sendWhatsApp } from "../twilio";
import { addReminder } from "../prisma";
import { normalizeTo24Hour } from "../helper/helper";

export async function handleScheduleCommand(from: string, body: string) {
  // Remove "Schedule" keyword
  const commandBody = body.replace(/^schedule\s+/i, "").trim();

  // Split input into tokens
  const tokens = commandBody.split(" ");
  if (tokens.length < 3) {
    return await sendWhatsApp(
      from,
      "❌ Invalid format. Example:\nSchedule 10-Jan 10:15AM Buy Groceries"
    );
  }

  const dateStr = tokens[0]; // "06-Jan"
  let timeStr = tokens[1]; // "8:50PM" or "20:50"
  const title = tokens.slice(2).join(" "); // "Buy Groceries"

  try {
    timeStr = normalizeTo24Hour(timeStr);
  } catch (err) {
    console.error("Time normalization error:", err);
    return await sendWhatsApp(
      from,
      "❌ Invalid time format. Use 12h (8:50PM) or 24h (20:50)"
    );
  }

  const currentYear = new Date().getFullYear();
  const dateTimeStr = `${dateStr}-${currentYear} ${timeStr}`; // "06-Jan-2026 21:50"
  const scheduledAt = dayjs(dateTimeStr, "DD-MMM HH:mm", true);

  if (!scheduledAt.isValid()) {
    return await sendWhatsApp(
      from,
      "❌ Invalid date/time. Use format: 06-Jan 8:50PM or 06-Jan 20:50"
    );
  }

  try {
    // Save to DB
    const reminder = await addReminder(from, title, scheduledAt.toISOString());

    // Confirmation message
    await sendWhatsApp(
      from,
      `✅ Reminder scheduled!\n"${reminder.title}" at ${scheduledAt.format(
        "DD MMM YYYY, hh:mm A"
      )}`
    );
  } catch (err) {
    console.error("Error saving reminder:", err);
    await sendWhatsApp(
      from,
      "❌ Something went wrong while saving your reminder. Please try again."
    );
  }
}
