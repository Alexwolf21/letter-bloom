import { NextResponse } from "next/server";
import { deleteOldLetters } from "@/lib/storage";

/**
 * CRON Trigger: Daily Housekeeping
 * Removes letters older than 30 days to optimize database performance.
 */

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Security check for Vercel Cron
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const deletedCount = await deleteOldLetters(30);
    return NextResponse.json({ 
      success: true, 
      message: `Housekeeping complete. ${deletedCount} old letters removed.`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Cron Housekeeping Error:", error);
    return NextResponse.json({ success: false, error: "Housekeeping failed" }, { status: 500 });
  }
}
