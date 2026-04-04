import { NextResponse } from "next/server";
import { notifyGirlfriend } from "@/lib/sms";

/**
 * CRON Trigger: 6 AM PHT (22:00 UTC)
 * Notifies the girlfriend that a new love letter has bloomed.
 */

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const result = await notifyGirlfriend(appUrl);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Cron Notify Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send notification" }, { status: 500 });
  }
}
