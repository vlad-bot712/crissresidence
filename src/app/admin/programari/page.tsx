import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import AppointmentsClient from "@/components/admin/AppointmentsClient";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
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
    orderBy: [
      { appointmentDate: "desc" },
      { appointmentTime: "asc" },
    ],
  });

  return (
    <AppointmentsClient
      initialAppointments={JSON.parse(JSON.stringify(appointments))}
    />
  );
}
