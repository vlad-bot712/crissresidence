"use client";

import React, { useState } from "react";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  Bell,
  Check,
  Loader2,
  Send,
  Shield,
  Smartphone,
  Share2,
} from "lucide-react";

interface SettingsClientProps {
  initialSettings: Record<string, string>;
  initialSlots: { id: string; dayOfWeek: number; time: string; isActive: boolean }[];
  vapidPublicKey: string;
}

export default function SettingsClient({
  initialSettings,
  initialSlots,
  vapidPublicKey,
}: SettingsClientProps) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [slots, setSlots] = useState(initialSlots);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Push notifications state
  const [pushStatus, setPushStatus] = useState<string>("");
  const [testingPush, setTestingPush] = useState(false);

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSlot = (day: number, time: string) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.dayOfWeek === day && s.time === time ? { ...s, isActive: !s.isActive } : s
      )
    );
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, slots }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Subscribe to Web Push Notifications
  const enablePushNotifications = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus("Notificările Push nu sunt suportate de acest browser.");
      return;
    }

    try {
      setPushStatus("Se solicită permisiunea de la browser...");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setPushStatus("Permisiunea pentru notificări a fost refuzată.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to PushManager
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Save subscription in backend
      const res = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
        }),
      });

      if (res.ok) {
        setPushStatus("Notificările Push au fost activate cu succes pe acest dispozitiv!");
      } else {
        setPushStatus("Eroare la salvarea abonării în server.");
      }
    } catch (err: any) {
      console.error(err);
      setPushStatus(`Eroare la activare: ${err.message}`);
    }
  };

  // Test Push notification
  const handleTestPush = async () => {
    setTestingPush(true);
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const data = await res.json();
      setPushStatus(data.message || "Notificare de test trimisă!");
    } catch (e: any) {
      setPushStatus(`Eroare la test: ${e.message}`);
    } finally {
      setTestingPush(false);
    }
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const standardTimes = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const days = [
    { num: 1, name: "Luni" },
    { num: 2, name: "Marți" },
    { num: 3, name: "Miercuri" },
    { num: 4, name: "Joi" },
    { num: 5, name: "Vineri" },
    { num: 6, name: "Sâmbătă" },
  ];

  return (
    <form onSubmit={handleSaveAll} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A467]/20 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#967542] font-semibold">
            CONFIGURARE SISTEM
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#181818]">
            Setări Generale & Notificări
          </h1>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="py-3 px-6 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          <span>{savedSuccess ? "Salvat cu Succes!" : "Salvează Toate Modificările"}</span>
        </button>
      </div>

      {/* 1. Date de Contact & Companie */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A467]/25 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-semibold text-[#181818] flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#C5A467]" />
          <span>Informații de Contact Public</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Telefon Vânzări
            </label>
            <input
              type="text"
              value={settings.company_phone || ""}
              onChange={(e) => handleSettingChange("company_phone", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Email Oficial
            </label>
            <input
              type="email"
              value={settings.company_email || ""}
              onChange={(e) => handleSettingChange("company_email", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Adresă Sediu & Locație Ansamblu
            </label>
            <input
              type="text"
              value={settings.company_address || ""}
              onChange={(e) => handleSettingChange("company_address", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Program Afișat
            </label>
            <input
              type="text"
              value={settings.working_days || ""}
              onChange={(e) => handleSettingChange("working_days", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Durata Standard a unei Vizite
            </label>
            <input
              type="text"
              value={settings.appointment_duration || "45 minute"}
              onChange={(e) => handleSettingChange("appointment_duration", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Link Instagram
            </label>
            <input
              type="url"
              value={settings.instagram_url || ""}
              onChange={(e) => handleSettingChange("instagram_url", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#707070] uppercase mb-1">
              Link Facebook
            </label>
            <input
              type="url"
              value={settings.facebook_url || ""}
              onChange={(e) => handleSettingChange("facebook_url", e.target.value)}
              className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. Web Push Notifications Configuration */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A467]/25 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-[#181818] flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C5A467]" />
            <span>Notificări Push pe Telefon (PWA Web Push)</span>
          </h3>
        </div>

        <p className="text-xs text-[#707070] leading-relaxed">
          Permite primirea alertelor direct pe ecranul telefonului sau desktopului atunci când un client programează o vizită, anulează sau solicită reprogramarea.
        </p>

        {pushStatus && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            {pushStatus}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={enablePushNotifications}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Activează Notificările pe acest Dispozitiv</span>
          </button>

          <button
            type="button"
            onClick={handleTestPush}
            disabled={testingPush}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#C5A467] text-[#181818] hover:bg-[#C5A467]/10 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            {testingPush ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-[#967542]" />}
            <span>Trimite Notificare de Test</span>
          </button>
        </div>
      </div>

      {/* 3. Sloturi Orare & Zile Disponibile pentru Programări */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A467]/25 shadow-xs space-y-4">
        <h3 className="font-serif text-lg font-semibold text-[#181818] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#C5A467]" />
          <span>Intervale Orare Disponibile pentru Vizite</span>
        </h3>
        <p className="text-xs text-[#707070]">
          Apăsați pe orice slot orar pentru a-l activa (auriu) sau dezactiva (gri). Modificările se aplică instantaneu în calendarul de rezervări al clienților.
        </p>

        <div className="space-y-4 pt-2">
          {days.map((day) => (
            <div key={day.num} className="p-4 rounded-2xl bg-[#FAFAF8] border border-[#C5A467]/20">
              <span className="font-serif font-semibold text-sm text-[#181818] block mb-2">
                {day.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {standardTimes.map((time) => {
                  const match = slots.find(
                    (s) => s.dayOfWeek === day.num && s.time === time
                  );
                  const isActive = match ? match.isActive : true;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleSlot(day.num, time)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#C5A467] text-white shadow-2xs"
                          : "bg-gray-200 text-gray-400 line-through"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
