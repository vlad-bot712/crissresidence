"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar } from "lucide-react";
import { useBookingModal } from "./BookingContext";

export default function Navbar() {
  const pathname = usePathname();
  const { openBooking } = useBookingModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Acasă", href: "/" },
    { name: "Proprietăți", href: "/proprietati" },
    { name: "Contact & Întrebări", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#C5A467]/20 shadow-xs py-3.5 text-[#181818]"
            : "bg-gradient-to-b from-black/60 via-black/25 to-transparent py-5 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <img
              src="/icons/logo.png"
              alt="Criss Residence"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span
                className={`font-serif text-base md:text-lg font-semibold tracking-wider transition-colors duration-300 block leading-tight ${
                  isScrolled ? "text-[#181818]" : "text-white"
                }`}
              >
                CRISS RESIDENCE
              </span>
              <span
                className={`text-[9px] uppercase tracking-[0.25em] block transition-colors duration-300 ${
                  isScrolled ? "text-[#967542]" : "text-[#D8BE83]"
                }`}
              >
                Hereclean • Sălaj
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors relative py-1 ${
                    isScrolled
                      ? isActive
                        ? "text-[#967542] font-semibold"
                        : "text-[#181818] hover:text-[#C5A467]"
                      : isActive
                      ? "text-[#D8BE83] font-semibold"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full ${
                        isScrolled ? "bg-[#C5A467]" : "bg-[#D8BE83]"
                      }`}
                    />
                  )}
                </Link>
              );
            })}

            {/* CTA Button */}
            <button
              onClick={() => openBooking()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 bg-[#C5A467] text-white hover:bg-[#967542] shadow-sm hover:shadow-md gold-btn-pulse"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Programează o vizită</span>
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => openBooking()}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#C5A467] text-white"
            >
              Vizită
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled ? "text-[#181818] hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
              aria-label="Meniu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden flex flex-col justify-start pt-24 px-6">
          <div className="bg-[#FAFAF8] rounded-2xl p-6 shadow-2xl border border-[#C5A467]/30 text-[#181818] space-y-4">
            <div className="border-b border-[#C5A467]/20 pb-4">
              <span className="font-serif text-lg font-semibold tracking-wide">Meniu Navigare</span>
              <p className="text-xs text-[#707070]">Criss Residence • Hereclean, Sălaj</p>
            </div>

            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm uppercase tracking-wider font-medium py-2 px-3 rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-[#C5A467]/15 text-[#967542] font-semibold"
                      : "text-[#181818] hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-[#C5A467]/20">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBooking();
                }}
                className="w-full py-3 rounded-xl bg-[#C5A467] text-white font-medium text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Programează o vizită privată
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
