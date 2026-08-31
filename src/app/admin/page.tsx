import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const todayStr = new Date().toISOString().split("T")[0];

  // Fetch today's appointments
  const todayAppointments = await prisma.appointment.findMany({
    where: { appointmentDate: todayStr },
    include: {
      property: true,
      notes: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
    orderBy: { appointmentTime: "asc" },
  });

  // Calculate metrics
  const pendingCount = await prisma.appointment.count({
    where: { status: "În așteptare" },
  });

  const confirmedCount = await prisma.appointment.count({
    where: { status: "Confirmată" },
  });

  const doneCount = await prisma.appointment.count({
    where: { status: "Efectuată" },
  });

  const interestedCount = await prisma.appointment.count({
    where: { status: "Client interesat" },
  });

  return (
    <DashboardClient
      initialTodayAppointments={JSON.parse(JSON.stringify(todayAppointments))}
      initialPendingCount={pendingCount}
      initialConfirmedCount={confirmedCount}
      initialDoneCount={doneCount}
      initialInterestedCount={interestedCount}
    />
  );
}
