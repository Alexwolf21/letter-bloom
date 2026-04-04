import { NextResponse } from "next/server";
import { remindBoyfriend } from "@/lib/sms";

/**
 * CRON Trigger: 12 AM IST (18:30 UTC)
 * Reminds the boyfriend to write the letter for tomorrow.
 */

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const result = await remindBoyfriend();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Cron Remind Error:", error);
    return NextResponse.json({ success: false, error: "Failed to send reminder" }, { status: 500 });
  }
}
