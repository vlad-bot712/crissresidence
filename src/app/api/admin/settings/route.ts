import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const settingsList = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};
  settingsList.forEach((s) => {
    settingsObj[s.key] = s.value;
  });

  const slots = await prisma.availableTimeSlot.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
  });

  return NextResponse.json({
    settings: settingsObj,
    slots,
  });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  try {
    const { settings, slots } = await req.json();

    await prisma.$transaction(async (tx) => {
      if (settings && typeof settings === "object") {
        for (const [key, value] of Object.entries(settings)) {
          await tx.setting.upsert({
            where: { key },
            update: { value: String(value) },
            create: { key, value: String(value) },
          });
        }
      }

      if (slots && Array.isArray(slots)) {
        await tx.availableTimeSlot.deleteMany({});
        for (const slot of slots) {
          await tx.availableTimeSlot.create({
            data: {
              dayOfWeek: Number(slot.dayOfWeek),
              time: String(slot.time),
              isActive: Boolean(slot.isActive),
            },
          });
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Save settings error:", e);
    return NextResponse.json({ error: e.message || "Eroare la salvarea setărilor." }, { status: 500 });
  }
}
