import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "Panou Administrare | Criss Residence",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If not logged in, we let the login page display itself; other pages will redirect
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#181818] flex flex-col pb-20 md:pb-8">
      {session && <AdminNav adminName={session.name} />}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
