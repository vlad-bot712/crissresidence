import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import SettingsClient from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const settingsList = await prisma.setting.findMany();
  const settingsObj: Record<string, string> = {};
  settingsList.forEach((s) => {
    settingsObj[s.key] = s.value;
  });

  const slots = await prisma.availableTimeSlot.findMany({
    orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
  });

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

  return (
    <SettingsClient
      initialSettings={settingsObj}
      initialSlots={JSON.parse(JSON.stringify(slots))}
      vapidPublicKey={vapidPublicKey}
    />
  );
}
