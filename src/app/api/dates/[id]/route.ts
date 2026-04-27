import { NextRequest, NextResponse } from "next/server";
import { updateDateStatus } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, reason } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }
    const updated = await updateDateStatus(id, status, reason);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update date status" }, { status: 500 });
  }
}
