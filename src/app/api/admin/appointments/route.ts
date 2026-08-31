import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { sendPushNotificationToAdmins } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const search = searchParams.get("search");

  const where: any = {};

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (date) {
    where.appointmentDate = date;
  }

  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { phone: { contains: search } },
      { referenceCode: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      property: true,
      notes: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
    orderBy: [
      { appointmentDate: "asc" },
      { appointmentTime: "asc" },
    ],
  });

  return NextResponse.json(appointments);
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, reason, appointmentDate, appointmentTime, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID programare lipsă." }, { status: 400 });
    }

    const current = await prisma.appointment.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Programarea nu a fost găsită." }, { status: 404 });
    }

    const updateData: any = {};

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    if (appointmentDate) updateData.appointmentDate = appointmentDate;
    if (appointmentTime) updateData.appointmentTime = appointmentTime;

    let statusChanged = false;
    if (status && status !== current.status) {
      updateData.status = status;
      statusChanged = true;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const res = await tx.appointment.update({
        where: { id },
        data: updateData,
        include: {
          property: true,
          notes: { orderBy: { createdAt: "desc" } },
          statusHistory: { orderBy: { changedAt: "desc" } },
        },
      });

      if (statusChanged) {
        await tx.appointmentStatusHistory.create({
          data: {
            appointmentId: id,
            oldStatus: current.status,
            newStatus: status,
            reason: reason || `Status actualizat de ${session.name}`,
          },
        });
      }

      return res;
    });

    // Notify if important status change
    if (statusChanged && (status === "Reprogramată" || status === "Anulată")) {
      sendPushNotificationToAdmins({
        title: `Programare ${status}`,
        body: `${current.customerName} - ${current.property?.title || "Proprietate"}\nData: ${updated.appointmentDate}, ${updated.appointmentTime}`,
        url: `/admin`,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, appointment: updated });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json({ error: error.message || "Eroare la actualizare." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID programare lipsă." }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.appointmentNote.deleteMany({ where: { appointmentId: id } }),
      prisma.appointmentStatusHistory.deleteMany({ where: { appointmentId: id } }),
      prisma.appointment.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true, message: "Programarea a fost ștearsă cu succes." });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Eroare la ștergerea programării." }, { status: 500 });
  }
}
