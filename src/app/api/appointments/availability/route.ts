import { NextRequest, NextResponse } from "next/server";
import { getAvailableTimeSlotsForDate } from "@/lib/booking";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Parametrul 'date' este obligatoriu (YYYY-MM-DD)." }, { status: 400 });
  }

  const result = await getAvailableTimeSlotsForDate(date);
  if (result.error) {
    return NextResponse.json({ error: result.error, available: [], booked: [] }, { status: 400 });
  }

  return NextResponse.json(result);
}
