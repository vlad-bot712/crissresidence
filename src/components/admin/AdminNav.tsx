"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Building2,
  Settings,
  LogOut,
  Download,
  Share,
  X,
} from "lucide-react";

export default function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (!isStandalone) {
      // Check if user dismissed prompt recently
      const dismissed = localStorage.getItem("dismissed_pwa_prompt");
      if (!dismissed) {
        setShowPwaPrompt(true);
      }
    }

    // Register Service Worker for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered successfully:", reg.scope);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Programări", href: "/admin/programari", icon: CalendarCheck },
    { name: "Calendar", href: "/admin/calendar", icon: CalendarDays },
    { name: "Proprietăți", href: "/admin/proprietati", icon: Building2 },
    { name: "Setări", href: "/admin/setari", icon: Settings },
  ];

  return (
    <>
      {/* 1. Desktop & Mobile Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#C5A467]/20 shadow-2xs px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              src="/icons/logo.png"
              alt="Criss Residence"
              className="h-10 w-auto object-contain drop-shadow-xs"
            />
            <div>
              <span className="font-serif font-bold text-base tracking-wide text-[#181818] block leading-none">
                Criss Admin
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#967542] block mt-0.5">
                Hereclean
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-[#C5A467] text-white shadow-xs"
                    : "text-[#707070] hover:text-[#181818] hover:bg-[#FAFAF8]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-medium text-[#707070]">
            {adminName}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-[#707070] hover:text-red-600 transition-colors"
            title="Deconectare"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. PWA Add to Home Screen Banner (Mobile Only) */}
      {showPwaPrompt && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 px-4 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Download className="w-4 h-4 text-[#967542] flex-shrink-0" />
            <span>
              {isIos ? (
                <>
                  Instalează pe iPhone: Apasă <strong>Share <Share className="w-3 h-3 inline" /></strong> apoi{" "}
                  <strong>„Add to Home Screen”</strong> pentru acces rapid și notificări.
                </>
              ) : (
                <>
                  Adaugă panoul pe ecranul principal pentru acces rapid ca o aplicație mobilă.
                </>
              )}
            </span>
          </div>
          <button
            onClick={() => {
              setShowPwaPrompt(false);
              localStorage.setItem("dismissed_pwa_prompt", "true");
            }}
            className="p-1 text-amber-700 hover:text-amber-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3. Mobile Bottom Navigation Bar (Phone-First) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#C5A467]/25 py-2 px-3 md:hidden shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? "text-[#967542] font-bold scale-105"
                  : "text-[#707070] hover:text-[#181818]"
              }`}
            >
              <div
                className={`p-1.5 rounded-full ${
                  isActive ? "bg-[#C5A467]/15 text-[#967542]" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
