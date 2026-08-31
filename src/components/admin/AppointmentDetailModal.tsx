"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  Home,
  User,
  MessageSquare,
  FileText,
  History,
  CheckCircle,
  Clock3,
  XCircle,
  Star,
  RefreshCw,
  Plus,
  Loader2,
  Send,
  Share2,
  MapPin,
  ExternalLink,
  Trash2,
} from "lucide-react";

export interface AppointmentData {
  id: string;
  referenceCode: string;
  customerName: string;
  phone: string;
  email?: string | null;
  peopleCount: number;
  message?: string | null;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
  property?: {
    id: string;
    title: string;
    propertyType: string;
  } | null;
  notes?: {
    id: string;
    note: string;
    author: string;
    createdAt: string;
  }[];
  statusHistory?: {
    id: string;
    oldStatus: string;
    newStatus: string;
    reason?: string | null;
    changedAt: string;
  }[];
}

interface AppointmentDetailModalProps {
  appointment: AppointmentData;
  onClose: () => void;
  onUpdate: () => void;
}

export default function AppointmentDetailModal({
  appointment,
  onClose,
  onUpdate,
}: AppointmentDetailModalProps) {
  const [currentAppt, setCurrentAppt] = useState<AppointmentData>(appointment);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reprogramOpen, setReprogramOpen] = useState(false);
  const [newDate, setNewDate] = useState(appointment.appointmentDate);
  const [newTime, setNewTime] = useState(appointment.appointmentTime);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const handleDelete = async () => {
    if (
      !confirm(
        `Sigur doriți să ȘTERGEȚI DEFINITIV programarea pentru ${currentAppt.customerName} (${currentAppt.referenceCode})? Această acțiune nu poate fi anulată.`
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/appointments?id=${currentAppt.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onUpdate();
        onClose();
      } else {
        alert(data.error || "Eroare la ștergerea programării.");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("A apărut o eroare la ștergerea programării.");
    } finally {
      setDeleting(false);
    }
  };

  const statuses = [
    "În așteptare",
    "Confirmată",
    "Vizită astăzi",
    "Vizită în desfășurare",
    "Efectuată",
    "Client interesat",
    "Necesită follow-up",
    "Reprogramată",
    "Anulată",
    "Client absent",
  ];

  // Format Romanian phone number for WhatsApp: 0740... -> 40740...
  const rawPhone = currentAppt.phone.replace(/[^0-9]/g, "");
  const waPhone = rawPhone.startsWith("0") ? "4" + rawPhone : rawPhone.startsWith("40") ? rawPhone : "40" + rawPhone;

  // Pre-formatted messages for customer
  const propertyName = currentAppt.property?.title || "proiectul Criss Residence";
  const locationText = "Hereclean 35/A, DC12, jud. Sălaj (Google Maps: https://maps.google.com/?q=Hereclean+35A,+Salaj)";

  const waConfirmationMsg = encodeURIComponent(
    `Bună ziua, ${currentAppt.customerName}!\n\nVă confirmăm programarea pentru vizitarea proprietății: ${propertyName}.\n\n📅 Data: ${currentAppt.appointmentDate}\n⏰ Ora: ${currentAppt.appointmentTime}\n📍 Locație: ${locationText}\nCod rezervare: ${currentAppt.referenceCode}\n\nDacă aveți nevoie de îndrumare la sosire, ne puteți suna direct la acest număr. Vă așteptăm!\n— Criss Residence Hereclean`
  );

  const waReprogramMsg = encodeURIComponent(
    `Bună ziua, ${currentAppt.customerName}!\n\nProgramarea dumneavoastră la Criss Residence Hereclean (${propertyName}) a fost reprogramată pentru:\n📅 Data: ${newDate}\n⏰ Ora: ${newTime}\n📍 Locație: ${locationText}\nCod rezervare: ${currentAppt.referenceCode}\n\nVă dorim o zi excelentă!\n— Criss Residence`
  );

  const waLocationMsg = encodeURIComponent(
    `Bună ziua, ${currentAppt.customerName}! Iată locația exactă pe Google Maps pentru vizita la Criss Residence: https://maps.google.com/?q=Hereclean+35A,+Salaj (Hereclean 35/A, DC12). Vă așteptăm la ora stabilită!`
  );

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    setUpdatingStatus(true);
    setNotificationBanner(null);

    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentAppt.id,
          status: newStatus,
          reason: reason || `Status marcat ca ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setCurrentAppt(data.appointment);
        onUpdate();

        if (newStatus === "Confirmată") {
          setNotificationBanner("Status actualizat la 'Confirmată'. Poți trimite confirmarea pe WhatsApp printr-un click mai jos!");
        } else if (newStatus === "Anulată") {
          setNotificationBanner("Programarea a fost anulată, iar intervalul orar a fost ELIBERAT automat în site pentru alți clienți.");
        } else {
          setNotificationBanner(`Statusul a fost actualizat la "${newStatus}".`);
        }
      }
    } catch (e) {
      console.error("Status update error:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/appointments/${currentAppt.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote.trim() }),
      });
      const data = await res.json();
      if (data.success && data.note) {
        setCurrentAppt((prev) => ({
          ...prev,
          notes: [data.note, ...(prev.notes || [])],
        }));
        setNewNote("");
        onUpdate();
      }
    } catch (e) {
      console.error("Add note error:", e);
    } finally {
      setAddingNote(false);
    }
  };

  const handleReprogram = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingStatus(true);
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentAppt.id,
          status: "Reprogramată",
          appointmentDate: newDate,
          appointmentTime: newTime,
          reason: `Reprogramat pentru data de ${newDate}, ora ${newTime}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.appointment) {
        setCurrentAppt(data.appointment);
        setReprogramOpen(false);
        setNotificationBanner(`Vizita a fost reprogramată pentru ${newDate} la ${newTime}. Trimite mesajul pe WhatsApp mai jos.`);
        onUpdate();
      }
    } catch (e) {
      console.error("Reprogram error:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-[#C5A467]/30 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#C5A467]/20 flex items-center justify-between bg-[#FAFAF8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#C5A467] tracking-wider">
                {currentAppt.referenceCode}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                  currentAppt.status
                )}`}
              >
                {currentAppt.status}
              </span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-[#181818] mt-1">
              {currentAppt.customerName}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#707070] hover:text-[#181818] hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Notification Alert Banner */}
          {notificationBanner && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between gap-3 animate-fade-in">
              <span>{notificationBanner}</span>
              <button
                onClick={() => setNotificationBanner(null)}
                className="text-amber-700 hover:text-amber-900 text-xs font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* 1. NOTIFICĂRI DIRECTE CLIENT: WhatsApp & Telefon */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                Notifică Clientul Direct (1 Click)
              </span>
              <span className="text-[10px] text-emerald-800">
                Se deschide cu mesajul gata scris
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* WhatsApp Confirm */}
              <a
                href={`https://wa.me/${waPhone}?text=${waConfirmationMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmare WhatsApp</span>
              </a>

              {/* WhatsApp Location */}
              <a
                href={`https://wa.me/${waPhone}?text=${waLocationMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100/50 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trimite Harta Google</span>
              </a>

              {/* Direct Call */}
              <a
                href={`tel:${currentAppt.phone.replace(/\s+/g, "")}`}
                className="py-2.5 px-3 rounded-xl bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100/50 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sună ({currentAppt.phone})</span>
              </a>
            </div>
          </div>


          {/* Secondary Actions: Reprogram / Cancel */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#C5A467]/15">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReprogramOpen(!reprogramOpen)}
                className="px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reprogramează vizita</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Sigur anulați vizita? Ora va fi eliberată automat în calendar pentru alți clienți.")) {
                    handleStatusChange("Anulată");
                  }
                }}
                className="px-3 py-2 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-xs font-medium hover:bg-amber-100 flex items-center gap-1.5"
                title="Anulează și eliberează ora în site"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Anulează vizita</span>
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Șterge definitiv această programare din baza de date"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deleting ? "Se șterge..." : "Șterge definitiv"}</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#707070]">
              <span>Schimbă:</span>
              <select
                value={currentAppt.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="py-1.5 px-2 bg-white border border-[#C5A467]/30 rounded-lg text-[#181818] text-xs font-medium"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reprogram Form Drawer */}
          {reprogramOpen && (
            <form
              onSubmit={handleReprogram}
              className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 animate-fade-in"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Reprogramare vizită (Ora veche se va elibera automat)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-indigo-800 font-medium mb-1">
                    Dată nouă
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-indigo-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-indigo-800 font-medium mb-1">
                    Oră nouă
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-white border border-indigo-200"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Salvează reprogramarea
                </button>
                <a
                  href={`https://wa.me/${waPhone}?text=${waReprogramMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white text-indigo-700 border border-indigo-300 rounded-lg text-xs font-semibold hover:bg-indigo-50 flex items-center gap-1"
                >
                  <span>Anunță clientul pe WhatsApp</span>
                </a>
              </div>
            </form>
          )}

          {/* Appointment Data Sheet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAFAF8] border border-[#C5A467]/20 text-xs">
            <div>
              <span className="text-[#707070] block">Proprietate vizată:</span>
              <strong className="text-[#181818] font-medium text-sm">
                {currentAppt.property?.title || "Consultare Generală la Șantier"}
              </strong>
            </div>

            <div>
              <span className="text-[#707070] block">Data & Ora:</span>
              <strong className="text-[#181818] font-medium text-sm text-[#967542]">
                {currentAppt.appointmentDate} la {currentAppt.appointmentTime}
              </strong>
            </div>

            <div>
              <span className="text-[#707070] block">Număr persoane:</span>
              <span className="text-[#181818] font-medium">{currentAppt.peopleCount} persoane</span>
            </div>

            <div>
              <span className="text-[#707070] block">Email:</span>
              <span className="text-[#181818] font-medium">
                {currentAppt.email || "Nespecificat"}
              </span>
            </div>

            <div>
              <span className="text-[#707070] block">Înregistrată la:</span>
              <span className="text-[#707070]">
                {new Date(currentAppt.createdAt).toLocaleString("ro-RO")}
              </span>
            </div>

            {currentAppt.message && (
              <div className="col-span-2 pt-2 border-t border-[#C5A467]/15">
                <span className="text-[#707070] block font-semibold">Mesaj transmis de client:</span>
                <p className="text-[#181818] italic mt-0.5">„{currentAppt.message}”</p>
              </div>
            )}
          </div>

          {/* Internal Notes Section (Secret, invisible to customer) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-semibold text-base text-[#181818] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#C5A467]" />
                <span>Notițe Interne (Vizibile doar pentru echipă)</span>
              </h4>
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Client interesat de varianta la cheie, buget ~140.000 €, credit aprobat..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#C5A467]/30 rounded-xl text-xs text-[#181818] focus:outline-none focus:border-[#C5A467]"
              />
              <button
                type="submit"
                disabled={addingNote || !newNote.trim()}
                className="px-4 py-2 rounded-xl bg-[#C5A467] text-white text-xs font-semibold hover:bg-[#967542] transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {addingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Adaugă</span>
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentAppt.notes && currentAppt.notes.length > 0 ? (
                currentAppt.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#707070]">
                      <span className="font-semibold text-amber-900">{note.author}</span>
                      <span>{new Date(note.createdAt).toLocaleString("ro-RO")}</span>
                    </div>
                    <p className="text-[#181818]">{note.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#707070] italic">Nicio notiță internă salvată.</p>
              )}
            </div>
          </div>

          {/* Status History Timeline */}
          {currentAppt.statusHistory && currentAppt.statusHistory.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#C5A467]/15">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#707070] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#C5A467]" />
                <span>Istoric Modificări Status</span>
              </h4>
              <div className="space-y-1.5">
                {currentAppt.statusHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="flex items-center justify-between text-[11px] p-2 bg-gray-50 rounded-lg text-[#707070]"
                  >
                    <div>
                      <span className="font-medium text-[#181818]">{hist.newStatus}</span>
                      {hist.reason && <span className="ml-2 italic text-gray-500">— {hist.reason}</span>}
                    </div>
                    <span>{new Date(hist.changedAt).toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
