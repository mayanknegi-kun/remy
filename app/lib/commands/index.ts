import {
  commandListMessage,
  fallbackMessage,
  isGreeting,
} from "../helper/whatsapp";
import { sendWhatsApp } from "../twilio";
import { listReminders } from "./list";
import { handleScheduleCommand } from "./schedule";

export async function handleCommand(from: string, message: string) {
  // Placeholder for command handling logic
  const lower = message.trim().toLowerCase();

  if (isGreeting(lower)) {
    return await sendWhatsApp(from, commandListMessage());
  }

  if (lower.startsWith("schedule")) {
    return await handleScheduleCommand(from, message);
  }

  if (lower.startsWith("list")) {
    const allRemainderRequired = lower.includes("all");
    return await listReminders(from, allRemainderRequired);
  }

  return await sendWhatsApp(from, fallbackMessage());
}
