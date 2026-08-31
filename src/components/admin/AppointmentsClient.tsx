"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Phone,
  Calendar,
  Clock,
  Home,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Loader2,
  Trash2,
} from "lucide-react";
import AppointmentDetailModal, { AppointmentData } from "./AppointmentDetailModal";

interface AppointmentsClientProps {
  initialAppointments: AppointmentData[];
}

export default function AppointmentsClient({
  initialAppointments,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState<AppointmentData[]>(initialAppointments);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedAppt, setSelectedAppt] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "Toate", value: "ALL" },
    { label: "În așteptare", value: "În așteptare" },
    { label: "Confirmată", value: "Confirmată" },
    { label: "Vizită astăzi", value: "Vizită astăzi" },
    { label: "Vizită în desfășurare", value: "Vizită în desfășurare" },
    { label: "Efectuată", value: "Efectuată" },
    { label: "Client interesat", value: "Client interesat" },
    { label: "Necesită follow-up", value: "Necesită follow-up" },
    { label: "Reprogramată", value: "Reprogramată" },
    { label: "Anulată", value: "Anulată" },
    { label: "Client absent", value: "Client absent" },
  ];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/appointments?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setAppointments(data);
        if (selectedAppt) {
          const updated = data.find((a) => a.id === selectedAppt.id);
          if (updated) setSelectedAppt(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDelete = async (id: string, name: string) => {
    if (!confirm(`Sigur doriți să ȘTERGEȚI DEFINITIV programarea pentru ${name}? Această acțiune nu poate fi anulată.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchAppointments();
      } else {
        alert(data.error || "Eroare la ștergerea programării.");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("A apărut o eroare la ștergerea programării.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedStatus]);

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Confirmată":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Vizită astăzi":
      case "Vizită în desfășurare":
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
      case "Client absent":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A467]/20 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#967542] font-semibold">
            GESTIUNE VIZITE & PROGRAMĂRI
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#181818]">
            Toate Programările ({appointments.length})
          </h1>
        </div>

        <button
          onClick={fetchAppointments}
          className="p-2.5 rounded-xl bg-white border border-[#C5A467]/30 text-[#707070] hover:text-[#181818] transition-colors self-start sm:self-auto flex items-center gap-1.5 text-xs font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizează</span>
        </button>
      </div>

      {/* Search and Status Pills */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Caută după nume client, număr telefon sau cod (ex: CR-2026-0001)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-xs sm:text-sm text-[#181818] focus:outline-none focus:border-[#C5A467]"
          />
        </div>

        {/* Status Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedStatus === st.value
                  ? "bg-[#C5A467] text-white shadow-xs"
                  : "bg-white border border-[#C5A467]/25 text-[#707070] hover:text-[#181818]"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading && appointments.length === 0 ? (
        <div className="p-12 text-center text-[#707070]">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A467] mx-auto mb-2" />
          <p className="text-xs">Se încarcă programările...</p>
        </div>
      ) : appointments.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              onClick={() => setSelectedAppt(appt)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#C5A467]/25 hover:border-[#C5A467] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C5A467]">
                    {appt.referenceCode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                  {appt.notes && appt.notes.length > 0 && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                      {appt.notes.length} {appt.notes.length === 1 ? "notiță" : "notițe"}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-semibold text-base sm:text-lg text-[#181818]">
                  {appt.customerName}
                </h3>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#707070] pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A467]" />
                    <strong className="text-[#181818]">{appt.appointmentDate}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A467]" />
                    <strong className="text-[#181818]">{appt.appointmentTime}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-[#C5A467]" />
                    <span>{appt.property?.title || "Consultare Generală"}</span>
                  </span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={`tel:${appt.phone.replace(/\s+/g, "")}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                  title="Apelează clientul"
                >
                  <Phone className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickDelete(appt.id, appt.customerName);
                  }}
                  className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                  title="Șterge definitiv programarea"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-2.5 rounded-xl bg-[#FAFAF8] text-[#967542] border border-[#C5A467]/30 flex items-center gap-1 text-xs font-semibold">
                  <span>Detalii</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#C5A467]/20 text-[#707070] space-y-2">
          <Calendar className="w-8 h-8 mx-auto text-[#C5A467]" />
          <h3 className="font-serif text-lg font-medium text-[#181818]">
            Nicio programare găsită
          </h3>
          <p className="text-xs">Încercați să resetați filtrele sau termenul de căutare.</p>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppt && (
        <AppointmentDetailModal
          appointment={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onUpdate={fetchAppointments}
        />
      )}
    </div>
  );
}
