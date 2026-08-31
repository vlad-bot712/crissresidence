import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import PropertiesClient from "@/components/admin/PropertiesClient";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const properties = await prisma.property.findMany({
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  return <PropertiesClient initialProperties={JSON.parse(JSON.stringify(properties))} />;
}
