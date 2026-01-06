// Greeting detection
export function isGreeting(text: string) {
  return ["hi", "hello", "hey", "hii", "hola"].includes(text);
}
// Command list message
export function commandListMessage() {
  return `
👋 Hey! I’m your WhatsApp Scheduler Bot.

Here’s what you can do:

📌 *Schedule a reminder*
Schedule 10-Jan 10:15AM Buy Groceries

📋 *List reminders*
List

❌ *Cancel a reminder*
Cancel 2 /reminder id

ℹ️ *Help*
Help

Just type a command to get started 🙂
`.trim();
}

// Fallback message
export function fallbackMessage() {
  return "❌ I didn’t understand that.\nType *Hi* to see available commands.";
}
