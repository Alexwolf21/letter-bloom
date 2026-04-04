/**
 * Modular SMS Service for Love Letter Bloom.
 * Replace Mock with Twilio for production.
 */

export interface SMSMessage {
  to: string;
  body: string;
}

export async function sendSMS({ to, body }: SMSMessage) {
  const isProd = process.env.NODE_ENV === "production";
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (isProd && twilioSid && twilioToken && fromNumber) {
    // Real Twilio Implementation (Mocked for now as we don't have the package installed yet)
    console.log(`[SMS PROD] Sending to ${to}: ${body}`);
    return { success: true, provider: "twilio" };
  } else {
    // Mock Service for Development
    console.log("-----------------------------------------");
    console.log("💌 [MOCK SMS NOTIFICATION]");
    console.log(`TO: ${to}`);
    console.log(`MESSAGE: ${body}`);
    console.log("-----------------------------------------");
    return { success: true, provider: "mock" };
  }
}

/**
 * Convenience method for Girlfriend notification
 */
export async function notifyGirlfriend(link: string) {
  const body = `Good morning beautiful! 🌸 A new love letter has bloomed for you. Open it here: ${link}`;
  return sendSMS({ to: process.env.GIRLFRIEND_PHONE || "+1234567890", body });
}

/**
 * Convenience method for Boyfriend reminder
 */
export async function remindBoyfriend() {
  const body = `Hey! It's night time. Don't forget to bloom a letter for tomorrow. ✍️❤️`;
  return sendSMS({ to: process.env.BOYFRIEND_PHONE || "+0987654321", body });
}
