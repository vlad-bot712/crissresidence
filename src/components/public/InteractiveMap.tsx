"use client";

import React from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface InteractiveMapProps {
  address?: string;
}

export default function InteractiveMap({
  address = "Hereclean 35/A, DC12, Hereclean, Sălaj",
}: InteractiveMapProps) {
  // Exact Google Maps location for Hereclean 35/A, DC12, Sălaj
  const query = encodeURIComponent("Hereclean 35/A, DC12, Hereclean, Salaj, Romania");
  
  // Real Google Maps embed (reliable, crisp, familiar Google Maps interface)
  const googleEmbedUrl = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  
  // Direct Google Maps navigation link
  const googleMapsAppUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="relative w-full h-[460px] md:h-[520px] rounded-3xl overflow-hidden border border-[#C5A467]/30 shadow-xl bg-gray-100">
      {/* Real Google Maps Embed */}
      <iframe
        title="Locație Google Maps Criss Residence Hereclean"
        width="100%"
        height="100%"
        className="w-full h-full border-0"
        src={googleEmbedUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Luxury Glass Floating Info Card */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-[#FAFAF8]/95 backdrop-blur-md p-5 rounded-2xl border border-[#C5A467]/30 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C5A467]/15 border border-[#C5A467] flex items-center justify-center text-[#967542] flex-shrink-0 mt-0.5">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#967542] block">
              LOCAȚIE EXCLUSIVISTĂ GOOGLE MAPS
            </span>
            <h4 className="font-serif font-semibold text-base text-[#181818] mt-0.5">
              Criss Residence Hereclean
            </h4>
            <p className="text-xs text-[#707070] mt-1 leading-relaxed">
              {address}
            </p>
            <p className="text-[11px] text-[#967542] font-medium mt-1">
              • Doar 7 minute distanță de Zalău pe drum asfaltat DC12
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#C5A467]/20 flex items-center gap-2">
          <a
            href={googleMapsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Deschide în Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
