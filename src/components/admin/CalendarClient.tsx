"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Home,
} from "lucide-react";
import AppointmentDetailModal, { AppointmentData } from "./AppointmentDetailModal";

interface CalendarClientProps {
  appointments: AppointmentData[];
}

export default function CalendarClient({ appointments }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedAppt, setSelectedAppt] = useState<AppointmentData | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  const prev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === "week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const next = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === "week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const today = () => setCurrentDate(new Date());

  // Month calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun

  // Helpers to get appointments for a given date
  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter((a) => a.appointmentDate === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A467]/20 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#967542] font-semibold">
            PROGRAMĂRI & DISPONIBILITĂȚI
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#181818]">
            Calendar Vizite
          </h1>
        </div>

        {/* View Mode Switcher (Zi / Săptămână / Lună) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#C5A467]/25 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode("day")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === "day"
                ? "bg-[#C5A467] text-white"
                : "text-[#707070] hover:text-[#181818]"
            }`}
          >
            Zi
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === "week"
                ? "bg-[#C5A467] text-white"
                : "text-[#707070] hover:text-[#181818]"
            }`}
          >
            Săptămână
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === "month"
                ? "bg-[#C5A467] text-white"
                : "text-[#707070] hover:text-[#181818]"
            }`}
          >
            Lună
          </button>
        </div>
      </div>

      {/* Navigation & Month Title */}
      <div className="bg-white p-4 rounded-2xl border border-[#C5A467]/25 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="p-2 rounded-lg hover:bg-[#FAFAF8] text-[#707070] hover:text-[#181818] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="p-2 rounded-lg hover:bg-[#FAFAF8] text-[#707070] hover:text-[#181818] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="font-serif text-lg sm:text-xl font-semibold text-[#181818] ml-2">
            {viewMode === "month" && `${monthNames[month]} ${year}`}
            {viewMode === "day" &&
              currentDate.toLocaleDateString("ro-RO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            {viewMode === "week" && `Săptămâna curentă • ${monthNames[month]} ${year}`}
          </span>
        </div>

        <button
          onClick={today}
          className="px-3 py-1.5 rounded-xl border border-[#C5A467]/40 text-[#967542] hover:bg-[#C5A467]/10 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Astăzi
        </button>
      </div>

      {/* 1. MONTH VIEW */}
      {viewMode === "month" && (
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#C5A467]/25 shadow-xs overflow-hidden">
          {/* Day Names (Mon to Sun) */}
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-[#707070] mb-2 pb-2 border-b border-[#C5A467]/15">
            {["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"].map((d, i) => (
              <span key={d} className={i === 6 ? "text-red-400" : ""}>
                {d}
              </span>
            ))}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots before first of month */}
            {Array.from({ length: (firstDay + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] bg-gray-50/50 rounded-xl" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                dayNum
              ).padStart(2, "0")}`;
              const dayAppts = getAppointmentsForDate(dateStr);
              const isToday =
                new Date().toISOString().split("T")[0] === dateStr;

              return (
                <div
                  key={dayNum}
                  className={`min-h-[70px] sm:min-h-[95px] p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? "border-[#C5A467] bg-[#C5A467]/5 shadow-2xs"
                      : "border-gray-100 hover:border-[#C5A467]/40 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? "w-5 h-5 rounded-full bg-[#C5A467] text-white flex items-center justify-center"
                          : "text-[#181818]"
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayAppts.length > 0 && (
                      <span className="text-[10px] font-bold text-[#967542]">
                        {dayAppts.length} viz.
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-16">
                    {dayAppts.map((appt) => (
                      <button
                        key={appt.id}
                        onClick={() => setSelectedAppt(appt)}
                        className="w-full text-left px-1.5 py-0.5 rounded bg-[#C5A467]/15 hover:bg-[#C5A467]/30 text-[10px] font-medium text-[#181818] truncate block transition-colors"
                      >
                        <strong>{appt.appointmentTime}</strong> {appt.customerName}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DAY VIEW */}
      {viewMode === "day" && (
        <div className="bg-white rounded-3xl p-6 border border-[#C5A467]/25 shadow-xs space-y-4">
          {(() => {
            const dateStr = currentDate.toISOString().split("T")[0];
            const dayAppts = getAppointmentsForDate(dateStr);

            return dayAppts.length > 0 ? (
              <div className="space-y-3">
                {dayAppts.map((appt) => (
                  <div
                    key={appt.id}
                    onClick={() => setSelectedAppt(appt)}
                    className="p-4 rounded-2xl border border-[#C5A467]/25 hover:border-[#C5A467] bg-[#FAFAF8] cursor-pointer flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-serif font-bold text-xl text-[#967542]">
                        {appt.appointmentTime}
                      </span>
                      <div>
                        <h4 className="font-medium text-base text-[#181818]">{appt.customerName}</h4>
                        <p className="text-xs text-[#707070]">
                          {appt.property?.title || "Consultare Generală"} • {appt.phone}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-white text-[#967542] border-[#C5A467]/30">
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[#707070] space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-[#C5A467]" />
                <p className="text-sm">Nicio vizită programată pentru această zi.</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. WEEK VIEW */}
      {viewMode === "week" && (
        <div className="bg-white rounded-3xl p-6 border border-[#C5A467]/25 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, idx) => {
              const startOfWeek = new Date(currentDate);
              const currentDayOfWeek = (startOfWeek.getDay() + 6) % 7;
              startOfWeek.setDate(startOfWeek.getDate() - currentDayOfWeek + idx);

              const dateStr = startOfWeek.toISOString().split("T")[0];
              const dayAppts = getAppointmentsForDate(dateStr);

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-[#C5A467]/20 bg-[#FAFAF8] flex flex-col min-h-[160px]"
                >
                  <span className="text-xs font-bold text-[#181818] block border-b border-[#C5A467]/20 pb-1.5">
                    {startOfWeek.toLocaleDateString("ro-RO", { weekday: "short", day: "numeric", month: "short" })}
                  </span>

                  <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto">
                    {dayAppts.map((appt) => (
                      <button
                        key={appt.id}
                        onClick={() => setSelectedAppt(appt)}
                        className="w-full text-left p-1.5 rounded-lg bg-white border border-[#C5A467]/30 text-xs shadow-2xs hover:bg-[#C5A467]/10 transition-colors"
                      >
                        <span className="font-bold text-[#967542] block text-[11px]">
                          {appt.appointmentTime}
                        </span>
                        <span className="font-medium text-[#181818] block truncate">
                          {appt.customerName}
                        </span>
                      </button>
                    ))}
                    {dayAppts.length === 0 && (
                      <span className="text-[11px] text-[#707070] italic">Liber</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onUpdate={() => {}}
        />
      )}
    </div>
  );
}
