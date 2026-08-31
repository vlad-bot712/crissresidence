import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import CalendarClient from "@/components/admin/CalendarClient";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      property: true,
      notes: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
    orderBy: { appointmentTime: "asc" },
  });

  return <CalendarClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
