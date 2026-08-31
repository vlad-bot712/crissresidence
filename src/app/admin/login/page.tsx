"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@crissresidence.ro");
  const [password, setPassword] = useState("Criss2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Autentificare eșuată.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#C5A467]/30 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <img
            src="/icons/logo.png"
            alt="Criss Residence"
            className="h-24 w-auto object-contain mx-auto mb-3 drop-shadow-md"
          />
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
            ADMINISTRARE REZIDENȚIALĂ
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#181818]">
            Panou de Control
          </h1>
          <p className="text-xs text-[#707070]">
            Conectați-vă pentru a gestiona programările și proprietățile
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#707070] mb-1">
              Parolă
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C5A467] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAFAF8] border border-[#C5A467]/30 rounded-xl text-sm text-[#181818] focus:outline-none focus:border-[#C5A467]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white font-medium text-xs uppercase tracking-widest transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Se verifică...
                </>
              ) : (
                <>Autentificare în Panou</>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-[#C5A467]/15 text-center text-xs text-[#707070]">
          <p>Credențiale implicite demonstrative pre-completate.</p>
          <a href="/" className="inline-block mt-2 text-[#967542] hover:underline">
            ← Înapoi pe website
          </a>
        </div>
      </div>
    </div>
  );
}
