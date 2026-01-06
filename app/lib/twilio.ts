import { Twilio } from "twilio";

const accountSid = process.env.NEXT_PUBLIC_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_ACCOUNT_AUTHTOKEN;
const client = new Twilio(accountSid, authToken);

export async function sendWhatsApp(to: string, body: string) {
  await client.messages.create({
    from: process.env.NEXT_TWILIO_WHATSAPP_FROM,
    to,
    body,
  });
}
