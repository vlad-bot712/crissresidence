"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Home,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useBookingModal } from "./BookingContext";

interface PropertyOption {
  id: string;
  title: string;
  propertyType: string;
  price: number;
  priceSuffix?: string | null;
}

export default function BookingModal() {
  const { isOpen, closeBooking, selectedPropertyId, selectedPropertyTitle } = useBookingModal();

  const [step, setStep] = useState(1);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [propertyId, setPropertyId] = useState<string>("");
  const [propertyTitle, setPropertyTitle] = useState<string>("");

  // Date selection state
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Time slot state
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [allSlots, setAllSlots] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slotError, setSlotError] = useState<string | null>(null);

  // Form details
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [peopleCount, setPeopleCount] = useState("2");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    referenceCode: string;
    customerName: string;
    propertyTitle: string;
    appointmentDate: string;
    appointmentTime: string;
    address: string;
  } | null>(null);

  // Fetch properties on mount
  useEffect(() => {
    fetch("/api/properties/list")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProperties(data);
        }
      })
      .catch(() => {});
  }, []);

  // Sync pre-selected property
  useEffect(() => {
    if (selectedPropertyId) {
      setPropertyId(selectedPropertyId);
      setPropertyTitle(selectedPropertyTitle || "");
      setStep(2); // Jump to date selection if property already chosen
    } else {
      setPropertyId("");
      setPropertyTitle("");
      setStep(1);
    }
  }, [selectedPropertyId, selectedPropertyTitle, isOpen]);

  // Load available slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSlotError(null);
    setSelectedTime("");

    fetch(`/api/appointments/availability?date=${selectedDate}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Eroare la verificarea disponibilității.");
        }
        setAllSlots(data.allSlots || []);
        setAvailableSlots(data.available || []);
      })
      .catch((err) => {
        setSlotError(err.message);
        setAllSlots([]);
        setAvailableSlots([]);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  if (!isOpen) return null;

  const handlePropertySelect = (p: PropertyOption) => {
    setPropertyId(p.id);
    setPropertyTitle(p.title);
    setStep(2);
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setSubmitError("Vă rugăm să bifați acordul pentru a fi contactat.");
      return;
    }
    if (!phone || phone.length < 9) {
      setSubmitError("Introduceți un număr de telefon valid.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          customerName,
          phone,
          email: email || undefined,
          peopleCount: parseInt(peopleCount, 10) || 1,
          message: message || undefined,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          consent: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "A apărut o problemă la înregistrarea programării.");
      }

      setConfirmedBooking({
        referenceCode: data.appointment.referenceCode,
        customerName: data.appointment.customerName,
        propertyTitle: data.appointment.propertyTitle,
        appointmentDate: data.appointment.appointmentDate,
        appointmentTime: data.appointment.appointmentTime,
        address: data.appointment.address,
      });

      setStep(5);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar Helpers
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun

  // Format month name in Romanian
  const monthNames = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const stepsHeader = [
    { num: 1, title: "Proprietate" },
    { num: 2, title: "Data" },
    { num: 3, title: "Ora" },
    { num: 4, title: "Date contact" },
    { num: 5, title: "Confirmare" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-2xl min-h-screen md:min-h-[560px] md:max-h-[92vh] bg-[#FAFAF8] text-[#181818] shadow-2xl border-0 md:border md:border-[#C5A467]/30 md:rounded-2xl flex flex-col overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#C5A467]/20 bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <img
              src="/icons/logo.png"
              alt="Criss Residence"
              className="h-10 w-auto object-contain drop-shadow-xs"
            />
            <div>
              <h2 className="font-serif text-lg md:text-xl font-semibold tracking-wide text-[#181818]">
                Programează o vizită privată
              </h2>
              <p className="text-xs text-[#707070]">Hereclean, Sălaj • Asistență personalizată</p>
            </div>
          </div>
          <button
            onClick={closeBooking}
            className="p-2 text-[#707070] hover:text-[#181818] hover:bg-[#FAFAF8] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 5 && (
          <div className="px-6 py-3 bg-[#FAFAF8] border-b border-[#C5A467]/15">
            <div className="flex items-center justify-between">
              {stepsHeader.map((s, idx) => (
                <div key={s.num} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      step === s.num
                        ? "bg-[#C5A467] text-white shadow-sm"
                        : step > s.num
                        ? "bg-[#C5A467]/20 text-[#967542]"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {s.num}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${
                      step === s.num ? "text-[#181818]" : "text-[#707070]"
                    }`}
                  >
                    {s.title}
                  </span>
                  {idx < stepsHeader.length - 1 && (
                    <div className="hidden sm:block w-4 h-[1px] bg-[#C5A467]/20 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* STEP 1: SELECT PROPERTY */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <h3 className="font-serif text-2xl text-[#181818]">Alege proprietatea dorită</h3>
                <p className="text-sm text-[#707070]">
                  Selectează imobilul sau tipul de locuință pe care dorești să o vizionezi în Hereclean.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {properties.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePropertySelect(p)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                      propertyId === p.id
                        ? "border-[#C5A467] bg-[#C5A467]/5 shadow-sm"
                        : "border-[#C5A467]/25 bg-white hover:border-[#C5A467] hover:bg-[#FAFAF8]"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#967542]">
                      {p.propertyType}
                    </span>
                    <h4 className="font-serif font-medium text-base text-[#181818] mt-1 leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#707070] mt-2">
                      De la{" "}
                      <strong className="text-[#181818] font-semibold">
                        {p.price.toLocaleString("ro-RO")} {p.priceSuffix || "€"}
                      </strong>
                    </p>
                  </button>
                ))}

                {/* Option to visit all / consult */}
                <button
                  onClick={() => {
                    setPropertyId("");
                    setPropertyTitle("Consultare Generală / Toate Casele");
                    setStep(2);
                  }}
                  className="text-left p-4 rounded-xl border border-dashed border-[#C5A467]/50 bg-white hover:border-[#C5A467] hover:bg-[#FAFAF8] transition-all"
                >
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#967542]">
                    CONSULTANȚĂ
                  </span>
                  <h4 className="font-serif font-medium text-base text-[#181818] mt-1">
                    Toate Proprietățile / Discuție la Șantier
                  </h4>
                  <p className="text-xs text-[#707070] mt-2">
                    Prezentare completă a proiectului Hereclean
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#181818]">Alege ziua vizitei</h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    Disponibil Luni - Sâmbătă. Duminica este închis.
                  </p>
                </div>
                {propertyTitle && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-[#967542] hover:underline flex items-center gap-1"
                  >
                    Schimbă proprietatea
                  </button>
                )}
              </div>

              {/* Month Navigation */}
              <div className="bg-white p-4 rounded-xl border border-[#C5A467]/20 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-[#FAFAF8] rounded-full transition-colors text-[#707070] hover:text-[#181818]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-serif font-semibold text-lg text-[#181818]">
                    {monthNames[month]} {year}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-[#FAFAF8] rounded-full transition-colors text-[#707070] hover:text-[#181818]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Day Headers (Mon - Sun) */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"].map((d, i) => (
                    <span
                      key={d}
                      className={`text-xs font-semibold py-1 ${
                        i === 6 ? "text-red-400" : "text-[#707070]"
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before 1st of month (Monday start adjustment) */}
                  {Array.from({
                    length: (firstDayOfWeek + 6) % 7,
                  }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10" />
                  ))}

                  {/* Month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateObj = new Date(year, month, dayNum);
                    dateObj.setHours(0, 0, 0, 0);

                    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
                    const isSunday = dayOfWeek === 0;
                    const isPast = dateObj < today;
                    const isDisabled = isSunday || isPast;

                    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                      dayNum
                    ).padStart(2, "0")}`;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dayNum}
                        disabled={isDisabled}
                        onClick={() => handleDateSelect(dateStr)}
                        className={`h-10 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                          isSelected
                            ? "bg-[#C5A467] text-white shadow-md font-semibold"
                            : isDisabled
                            ? "text-gray-300 cursor-not-allowed bg-transparent"
                            : "hover:bg-[#C5A467]/15 text-[#181818] bg-transparent"
                        }`}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT TIME SLOT */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#181818]">Alege ora potrivită</h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    Data selectată: <strong className="text-[#181818]">{selectedDate}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#967542] hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Altă zi
                </button>
              </div>

              {loadingSlots ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#707070]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C5A467] mb-2" />
                  <p className="text-sm">Se verifică intervalele disponibile...</p>
                </div>
              ) : slotError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{slotError}</span>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-[#707070] mb-3">
                    Intervalele gri sunt deja rezervate. Fiecare vizită durează aproximativ 45 de minute.
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {allSlots.map((slot) => {
                      const isAvailable = availableSlots.includes(slot);
                      const isSelected = selectedTime === slot;

                      return (
                        <button
                          key={slot}
                          disabled={!isAvailable}
                          onClick={() => handleTimeSelect(slot)}
                          className={`py-3 px-2 rounded-xl text-sm font-medium transition-all flex flex-col items-center justify-center border ${
                            isSelected
                              ? "border-[#C5A467] bg-[#C5A467] text-white shadow-md"
                              : isAvailable
                              ? "border-[#C5A467]/30 bg-white text-[#181818] hover:border-[#C5A467] hover:bg-[#C5A467]/10"
                              : "border-gray-200 bg-gray-100/60 text-gray-400 cursor-not-allowed line-through"
                          }`}
                        >
                          <span className="text-base font-semibold">{slot}</span>
                          <span className="text-[10px] mt-0.5 opacity-80">
                            {isAvailable ? "Disponibil" : "Ocupat"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {step === 4 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl text-[#181818]">Datele dumneavoastră</h3>
                  <p className="text-xs text-[#707070] mt-0.5">
                    Vizită: <strong className="text-[#181818]">{selectedDate}</strong> la ora{" "}
                    <strong className="text-[#181818]">{selectedTime}</strong>
                  </p>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-[#967542] hover:underline flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Schimbă ora
                </button>
              </div>

              {submitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
                    Nume și prenume *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Andrei Pop"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467] focus:ring-1 focus:ring-[#C5A467]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
                      Număr telefon *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="0740 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467] focus:ring-1 focus:ring-[#C5A467]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
                      Email (opțional pt. confirmare)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="exemplu@email.ro"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467] focus:ring-1 focus:ring-[#C5A467]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
                      Număr persoane (opțional)
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467]"
                      >
                        <option value="1">1 persoană</option>
                        <option value="2">2 persoane</option>
                        <option value="3">3 persoane</option>
                        <option value="4">4+ persoane</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
                      Proprietate vizată
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        disabled
                        value={propertyTitle || "Consultare generală"}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100/70 border border-gray-200 rounded-xl text-xs text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
                    Mesaj sau întrebări suplimentare (opțional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Ne interesează detalii despre finisaje sau stadiul la roșu..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467]"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#C5A467] text-[#C5A467] focus:ring-[#C5A467]"
                    />
                    <span className="text-xs text-[#707070] leading-relaxed">
                      Sunt de acord să fiu contactat telefonic sau prin email pentru confirmarea vizitei și detalii de acces la șantier.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 py-3.5 px-6 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white font-medium text-sm tracking-wider uppercase transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Se înregistrează...
                    </>
                  ) : (
                    <>Trimite solicitarea de vizită</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 5: SUCCESS / CONFIRMATION */}
          {step === 5 && confirmedBooking && (
            <div className="py-4 text-center">
              {/* Animated gold checkmark */}
              <div className="w-16 h-16 rounded-full bg-[#C5A467]/15 border-2 border-[#C5A467] flex items-center justify-center mx-auto mb-4 text-[#C5A467] shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="text-[11px] uppercase tracking-widest text-[#967542] font-semibold">
                ÎNREGISTRARE COMPLETĂ
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#181818] mt-1 mb-2">
                Vizita ta a fost înregistrată.
              </h3>
              <p className="text-xs md:text-sm text-[#707070] max-w-md mx-auto">
                Te vom contacta în scurt timp pentru confirmarea definitivă a intervalului.
              </p>

              {/* Booking Voucher Card */}
              <div className="mt-6 text-left bg-white border border-[#C5A467]/30 rounded-2xl p-5 shadow-sm max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-[#C5A467]/15">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/logo.png"
                      alt="Criss Residence"
                      className="h-8 w-auto object-contain"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#181818] tracking-wider block leading-tight">
                        CRISS RESIDENCE
                      </span>
                      <span className="text-[9px] text-[#967542] block">Hereclean, Sălaj</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#707070] block">Cod Rezervare</span>
                    <span className="font-mono text-sm font-bold text-[#C5A467] tracking-wider">
                      {confirmedBooking.referenceCode}
                    </span>
                  </div>
                </div>

                <div className="py-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#707070]">Client:</span>
                    <strong className="text-[#181818]">{confirmedBooking.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707070]">Proprietate:</span>
                    <strong className="text-[#181818] text-right">{confirmedBooking.propertyTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707070]">Data programată:</span>
                    <strong className="text-[#181818]">{confirmedBooking.appointmentDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707070]">Ora vizitei:</span>
                    <strong className="text-[#181818]">{confirmedBooking.appointmentTime}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#707070]">Locația:</span>
                    <strong className="text-[#181818] text-right">{confirmedBooking.address}</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#707070]">Status:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      În așteptarea confirmării
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={closeBooking}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  Înapoi la proprietate
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
