"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "În ce stadii pot cumpăra o casă?",
    answer:
      "Proprietățile pot fi disponibile în diferite etape de execuție: de la proiect și construcție la roșu (structură din beton armat și zidărie cu acoperiș finalizat), până la variante semifinisate avansate sau case complet finalizate la cheie.",
  },
  {
    question: "Pot programa o vizită?",
    answer:
      "Da. Vizitele pot fi programate direct prin website, de luni până sâmbătă, în funcție de intervalele orare disponibile. Veți primi o confirmare rapidă și un cod de rezervare.",
  },
  {
    question: "Pot cumpăra doar terenul?",
    answer:
      "Da, în funcție de disponibilitate punem la dispoziție și parcele de teren intravilan destinate construirii individuale de locuințe, beneficiind de utilități și acces stradal direct.",
  },
  {
    question: "Unde sunt situate proprietățile?",
    answer:
      "Toate imobilele sunt amplasate în Hereclean, județul Sălaj (la adresa Hereclean 35/A, DC12), într-o zonă rezidențială aerisită și liniștită, la doar câteva minute cu mașina de municipiul Zalău.",
  },
  {
    question: "Prețurile sunt negociabile?",
    answer:
      "Pentru informații exacte privind prețul final, modalitățile de plată eșalonată sau condițiile comerciale specifice fiecărei proprietăți, vă rugăm să ne contactați sau să programați o vizită dedicată.",
  },
  {
    question: "Pot alege finisajele?",
    answer:
      "În funcție de stadiul în care este achiziționată casa (în faza de proiect sau semifinisat), vă oferim flexibilitate completă în selectarea gresiei, faianței, parchetului, ușilor interioare și compartimentărilor sanitare.",
  },
  {
    question: "Există utilități?",
    answer:
      "Da. Informațiile despre utilități sunt prezentate transparent pentru fiecare proprietate în parte. Casele beneficiază de branșamente sau acces la rețeaua de apă, gaz metan, curent electric și canalizare.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-[#C5A467] bg-white shadow-sm"
                : "border-[#C5A467]/25 bg-white/70 hover:border-[#C5A467]/50 hover:bg-white"
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 focus:outline-none"
            >
              <span className="font-serif text-lg md:text-xl font-medium text-[#181818]">
                {faq.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                  isOpen
                    ? "bg-[#C5A467] text-white rotate-180"
                    : "bg-[#C5A467]/10 text-[#967542]"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 pt-1 text-sm md:text-base text-[#707070] leading-relaxed border-t border-[#C5A467]/15">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
