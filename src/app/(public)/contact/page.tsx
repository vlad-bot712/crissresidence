import React from "react";
import prisma from "@/lib/db";
import InteractiveMap from "@/components/public/InteractiveMap";
import FAQAccordion from "@/components/public/FAQAccordion";
import CTAButton from "@/components/public/CTAButton";
import { Phone, Mail, MapPin, Clock, MessageSquareQuote } from "lucide-react";

export const metadata = {
  title: "Contact & Întrebări Frecvente",
  description:
    "Contactați echipa Criss Residence pentru vizionări și detalii despre casele din Hereclean, Sălaj.",
};

export const revalidate = 60;

export default async function ContactPage() {
  // Load settings from DB
  const settingsList = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsList.forEach((s) => {
    settings[s.key] = s.value;
  });

  const phone = settings.company_phone || "0740 123 456";
  const email = settings.company_email || "contact@crissresidence.ro";
  const address = settings.company_address || "Hereclean 35/A, DC12, Hereclean, Sălaj";
  const workingDays = settings.working_days || "Luni – Sâmbătă: 09:00 – 18:00 (Duminică: Închis)";

  return (
    <div className="bg-[#FAFAF8] text-[#181818] min-h-screen pt-28 md:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 1. CONTACT HERO */}
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
            DIALOG DIRECT & CONSULTANȚĂ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#181818] mt-2 leading-tight">
            Hai să discutăm despre viitoarea ta casă.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#707070] leading-relaxed">
            Suntem aici să îți prezentăm proprietățile disponibile și să găsim împreună varianta potrivită pentru tine.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#C5A467] text-[#181818] hover:bg-[#C5A467]/10 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#967542]" />
              <span>Sună acum ({phone})</span>
            </a>

            <div className="w-full sm:w-auto">
              <CTAButton text="Programează o vizită" className="w-full" />
            </div>
          </div>
        </div>

        {/* 2. CONTACT DETAILS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Phone */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#C5A467]/25 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A467]/15 flex items-center justify-center text-[#967542]">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#707070] font-semibold block">
              TELEFON VÂNZĂRI
            </span>
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="font-serif text-xl font-medium text-[#181818] hover:text-[#C5A467] transition-colors block"
            >
              {phone}
            </a>
            <p className="text-xs text-[#707070]">
              Disponibil pentru apeluri și confirmări zilnice.
            </p>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#C5A467]/25 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A467]/15 flex items-center justify-center text-[#967542]">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#707070] font-semibold block">
              ADRESĂ EMAIL
            </span>
            <a
              href={`mailto:${email}`}
              className="font-serif text-xl font-medium text-[#181818] hover:text-[#C5A467] transition-colors block truncate"
            >
              {email}
            </a>
            <p className="text-xs text-[#707070]">
              Răspundem în maximum 24 de ore lucrătoare.
            </p>
          </div>

          {/* Card 3: Schedule & Location */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#C5A467]/25 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#C5A467]/15 flex items-center justify-center text-[#967542]">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#707070] font-semibold block">
              PROGRAM VIZITE
            </span>
            <p className="font-serif text-lg font-medium text-[#181818]">
              {workingDays}
            </p>
            <p className="text-xs text-[#707070]">
              {address}
            </p>
          </div>
        </div>

        {/* 3. INTERACTIVE MAP SECTION */}
        <div className="mb-24">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
              HARTĂ & ACCES
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#181818] mt-1">
              Amplasament & Ghidaj Rutier
            </h2>
            <p className="text-xs md:text-sm text-[#707070] mt-1">
              Hereclean 35/A, DC12, Județul Sălaj. Traseu complet asfaltat cu acces rapid spre DN1F și Zalău.
            </p>
          </div>

          <InteractiveMap address={address} />
        </div>

        {/* 4. FAQ SECTION */}
        <div className="pt-8 border-t border-[#C5A467]/20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A467]/10 text-[#967542] text-[11px] font-semibold uppercase tracking-wider mb-2">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>RĂSPUNSURI TRANSPARENTE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181818]">
              Întrebări Frecvente
            </h2>
            <p className="text-xs md:text-sm text-[#707070] mt-2">
              Tot ce trebuie să știți înainte de a achiziționa o casă sau un teren în ansamblul Criss Residence.
            </p>
          </div>

          <FAQAccordion />
        </div>
      </div>
    </div>
  );
}
