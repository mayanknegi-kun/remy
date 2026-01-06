import { handleCommand } from "@/app/lib/commands";
import { parseFormData } from "@/app/lib/helper/helper";
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

  await handleCommand(From, Body);
  return NextResponse.json({ success: true });
}
