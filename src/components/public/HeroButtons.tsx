"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { useBookingModal } from "./BookingContext";

export default function HeroButtons() {
  const { openBooking } = useBookingModal();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
      <Link
        href="/proprietati"
        className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#181818] hover:bg-[#FAFAF8] text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
      >
        <span>Descoperă proprietățile</span>
        <ArrowRight className="w-4 h-4 text-[#967542] group-hover:translate-x-1 transition-transform" />
      </Link>

      <button
        onClick={() => openBooking()}
        className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C5A467] hover:bg-[#967542] text-white text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 gold-btn-pulse"
      >
        <Calendar className="w-4 h-4" />
        <span>Programează o vizită</span>
      </button>
    </div>
  );
}
