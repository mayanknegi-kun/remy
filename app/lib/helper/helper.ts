export async function parseFormData<T = Record<string, string>>(
  req: Request
): Promise<T> {
  const formData = await req.formData();
  return Object.fromEntries(formData.entries()) as T;
}

function padNumber(num: number) {
  return num.toString().padStart(2, "0");
}

export function normalizeTo24Hour(timeStr: string): string {
  timeStr = timeStr.trim();

  let hours: number;
  let minutes: number;

  // Check if contains AM/PM
  const upper = timeStr.toUpperCase();
  const is12h = upper.includes("AM") || upper.includes("PM");

  if (is12h) {
    // Extract AM/PM
    const ampm = upper.includes("AM") ? "AM" : "PM";
    const timePart = timeStr.slice(0, -2); // remove AM/PM

    const parts = timePart.split(":");
    if (parts.length !== 2) throw new Error("Invalid 12-hour time");

    hours = Number(parts[0]);
    minutes = Number(parts[1]);
    if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid numbers");

    // Convert to 24-hour
    if (ampm === "AM" && hours === 12) hours = 0;
    if (ampm === "PM" && hours < 12) hours += 12;
  } else {
    // 24-hour format HH:MM
    const parts = timeStr.split(":");
    if (parts.length !== 2) throw new Error("Invalid 24-hour time");

    hours = Number(parts[0]);
    minutes = Number(parts[1]);
    if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid numbers");
  }

  return `${padNumber(hours)}:${padNumber(minutes)}`;
}
