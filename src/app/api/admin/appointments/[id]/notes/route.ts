import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const { id } = await params;
  const { note } = await req.json();

  if (!note || !note.trim()) {
    return NextResponse.json({ error: "Conținutul notiței este obligatoriu." }, { status: 400 });
  }

  const created = await prisma.appointmentNote.create({
    data: {
      appointmentId: id,
      note: note.trim(),
      author: session.name || "Admin",
    },
  });

  return NextResponse.json({ success: true, note: created });
}
