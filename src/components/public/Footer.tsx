"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, Shield } from "lucide-react";
import { useBookingModal } from "./BookingContext";

export default function Footer() {
  const { openBooking } = useBookingModal();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] text-white pt-16 pb-8 border-t border-[#C5A467]/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/icons/logo.png"
                alt="Criss Residence"
                className="h-16 w-auto object-contain drop-shadow-lg"
              />
              <div>
                <span className="font-serif text-xl tracking-wider font-semibold block text-white leading-tight">
                  CRISS RESIDENCE
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#D8BE83] block">
                  Hereclean • Sălaj
                </span>
              </div>
            </div>

            <p className="font-serif text-lg md:text-xl text-white/80 italic max-w-sm leading-relaxed pt-2">
              „Construim mai mult decât case. Construim locuri numite acasă.”
            </p>

            <p className="text-xs text-white/50 leading-relaxed max-w-md">
              Proiect rezidențial exclusivist dedicat familiilor care își doresc standarde superioare de
              construcție, liniște, aer curat și acces rapid către orașul Zalău.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8BE83]">
              Navigare Rapidă
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/70 hover:text-[#D8BE83] transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link
                  href="/proprietati"
                  className="text-white/70 hover:text-[#D8BE83] transition-colors"
                >
                  Proprietăți Disponibile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openBooking()}
                  className="text-white/70 hover:text-[#D8BE83] transition-colors text-left"
                >
                  Programează o Vizită
                </button>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/70 hover:text-[#D8BE83] transition-colors"
                >
                  Contact & Întrebări Frecvente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D8BE83]">
              Birou Vânzări & Vizite
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D8BE83] flex-shrink-0 mt-0.5" />
                <span>Hereclean 35/A, DC12, Județul Sălaj, România</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D8BE83] flex-shrink-0" />
                <a href="tel:0740123456" className="hover:text-white transition-colors">
                  +40 740 123 456
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D8BE83] flex-shrink-0" />
                <a href="mailto:contact@crissresidence.ro" className="hover:text-white transition-colors">
                  contact@crissresidence.ro
                </a>
              </li>
              <li className="pt-2">
                <span className="text-[11px] text-white/50 block">Program Vizite:</span>
                <span className="text-white/80 font-medium">Luni – Sâmbătă: 09:00 – 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>© {currentYear} Criss Residence. Toate drepturile rezervate.</p>

          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-white/70 transition-colors">
              Termeni & Confidențialitate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
