"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Star,
  Phone,
  ArrowRight,
  Eye,
  AlertCircle,
  Clock3,
  CalendarDays,
  Plus,
} from "lucide-react";
import AppointmentDetailModal, { AppointmentData } from "./AppointmentDetailModal";

interface DashboardClientProps {
  initialTodayAppointments: AppointmentData[];
  initialPendingCount: number;
  initialConfirmedCount: number;
  initialDoneCount: number;
  initialInterestedCount: number;
}

export default function DashboardClient({
  initialTodayAppointments,
  initialPendingCount,
  initialConfirmedCount,
  initialDoneCount,
  initialInterestedCount,
}: DashboardClientProps) {
  const [todayAppointments, setTodayAppointments] = useState<AppointmentData[]>(
    initialTodayAppointments
  );
  const [selectedAppt, setSelectedAppt] = useState<AppointmentData | null>(null);

  const refreshData = async () => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      const res = await fetch(`/api/admin/appointments?date=${todayStr}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTodayAppointments(data);
        if (selectedAppt) {
          const updated = data.find((a) => a.id === selectedAppt.id);
          if (updated) setSelectedAppt(updated);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Find next upcoming appointment today
  const nextVisit = todayAppointments.find(
    (a) => a.status === "Confirmată" || a.status === "În așteptare" || a.status === "Vizită astăzi"
  ) || todayAppointments[0];

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Confirmată":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Vizită astăzi":
        return "bg-amber-100 text-amber-900 border-amber-300 font-bold";
      case "Efectuată":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Client interesat":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "În așteptare":
        return "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "Reprogramată":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Anulată":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Quick Date Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C5A467]/20 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#967542] font-semibold">
            PANOU OPERAȚIONAL
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#181818]">
            Bun venit
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-[#C5A467]/25 text-xs text-[#707070] shadow-2xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A467]" />
            <span>
              Astăzi,{" "}
              {new Date().toLocaleDateString("ro-RO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Cards (5 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Today's visits */}
        <div className="bg-white p-4 rounded-2xl border border-[#C5A467]/25 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-[#707070] font-semibold block">
            Programări Astăzi
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#181818]">
              {todayAppointments.length}
            </span>
            <Clock3 className="w-4 h-4 text-[#C5A467]" />
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white p-4 rounded-2xl border border-yellow-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-yellow-800 font-semibold block">
            În așteptare
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-yellow-700">
              {initialPendingCount}
            </span>
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          </div>
        </div>

        {/* Card 3: Confirmed */}
        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-blue-800 font-semibold block">
            Vizite Confirmate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-blue-700">
              {initialConfirmedCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        {/* Card 4: Done */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-semibold block">
            Vizite Efectuate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
              {initialDoneCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Card 5: Interested */}
        <div className="bg-white p-4 rounded-2xl border border-purple-200/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase tracking-wider text-purple-800 font-semibold block">
            Clienți Interesați
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-purple-700">
              {initialInterestedCount}
            </span>
            <Star className="w-4 h-4 text-purple-600" />
          </div>
        </div>
      </div>

      {/* 3. HERO CARD: "URMĂTOAREA VIZITĂ" */}
      {nextVisit ? (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFFFFF] to-[#FAFAF8] border-2 border-[#C5A467] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C5A467] text-white">
                URMĂTOAREA VIZITĂ
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusBadge(
                  nextVisit.status
                )}`}
              >
                {nextVisit.status}
              </span>
            </div>

            <span className="font-serif font-bold text-2xl md:text-3xl text-[#967542]">
              {nextVisit.appointmentTime}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-xs text-[#707070] block">Proprietate:</span>
              <h3 className="font-serif font-semibold text-lg text-[#181818]">
                {nextVisit.property?.title || "Consultare Generală la Șantier"}
              </h3>
            </div>

            <div>
              <span className="text-xs text-[#707070] block">Client:</span>
              <p className="font-medium text-base text-[#181818]">{nextVisit.customerName}</p>
              <p className="text-xs text-[#707070] flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-[#C5A467]" />
                <span>{nextVisit.phone}</span>
              </p>
            </div>
          </div>

          {/* Quick Call & View Buttons */}
          <div className="pt-2 border-t border-[#C5A467]/20 flex items-center gap-3">
            <a
              href={`tel:${nextVisit.phone.replace(/\s+/g, "")}`}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Sună clientul</span>
            </a>

            <button
              onClick={() => setSelectedAppt(nextVisit)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Vezi programarea</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white border border-[#C5A467]/25 text-center text-[#707070] space-y-2">
          <Clock className="w-8 h-8 mx-auto text-[#C5A467]" />
          <h3 className="font-serif font-medium text-lg text-[#181818]">
            Nu mai sunt vizite programate pentru astăzi.
          </h3>
          <p className="text-xs">Consultați calendarul sau lista completă de programări.</p>
        </div>
      )}

      {/* 4. SECTION: "PROGRAMĂRI AZI" (Timeline) */}
      <div className="bg-white rounded-3xl p-6 border border-[#C5A467]/25 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#C5A467]/15 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C5A467]" />
            <h3 className="font-serif font-semibold text-lg text-[#181818]">
              Programări Astăzi — Timeline
            </h3>
          </div>
          <Link
            href="/admin/programari"
            className="text-xs text-[#967542] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Toate programările</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {todayAppointments.length > 0 ? (
          <div className="space-y-3">
            {todayAppointments.map((appt) => (
              <div
                key={appt.id}
                onClick={() => setSelectedAppt(appt)}
                className="group p-4 rounded-2xl border border-[#C5A467]/20 hover:border-[#C5A467] bg-[#FAFAF8]/50 hover:bg-[#FAFAF8] cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="font-serif text-lg font-bold text-[#967542] min-w-[55px]">
                    {appt.appointmentTime}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm text-[#181818] group-hover:text-[#967542] transition-colors">
                        {appt.customerName}
                      </h4>
                      <span className="text-xs text-[#707070]">({appt.phone})</span>
                    </div>
                    <p className="text-xs text-[#707070] mt-0.5">
                      {appt.property?.title || "Consultare Generală"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#C5A467] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#707070] italic py-4 text-center">
            Nicio programare înregistrată pentru data curentă.
          </p>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onUpdate={refreshData}
        />
      )}
    </div>
  );
}
