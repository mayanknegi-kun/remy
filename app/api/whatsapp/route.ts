import { parseFormData } from "@/app/lib/helper/helper";
import {
  commandListMessage,
  fallbackMessage,
  isGreeting,
} from "@/app/lib/helper/whatsapp";
import { sendWhatsApp } from "@/app/lib/twilio";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { ProfileName, Body, From, SmsMessageSid } = await parseFormData<{
    Body: string;
    From: string;
    SmsMessageSid: string;
    ProfileName: string;
  }>(request);

  if (!From || !Body) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const message = Body.trim().toLowerCase();

  if (isGreeting(message)) {
    await sendWhatsApp(From, commandListMessage());
    return NextResponse.json({ success: true });
  }
  await sendWhatsApp(From, fallbackMessage());
  return NextResponse.json({ success: true });
}
