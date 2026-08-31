"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { useBookingModal } from "./BookingContext";

export default function CTAButton({
  propertyId,
  propertyTitle,
  text = "Programează o vizită",
  className = "",
}: {
  propertyId?: string;
  propertyTitle?: string;
  text?: string;
  className?: string;
}) {
  const { openBooking } = useBookingModal();

  return (
    <button
      onClick={() => openBooking(propertyId, propertyTitle)}
      className={`px-8 py-4 rounded-full bg-[#C5A467] hover:bg-[#967542] text-white text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 gold-btn-pulse ${className}`}
    >
      <Calendar className="w-4 h-4" />
      <span>{text}</span>
    </button>
  );
}
