"use client";

import React from "react";
import Link from "next/link";
import { Bed, Bath, Home, MapPin, ArrowRight, Calendar, Compass, Check } from "lucide-react";
import { useBookingModal } from "./BookingContext";

export interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  propertyType: string;
  price: number;
  priceType?: string;
  priceSuffix?: string | null;
  status: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rooms?: number | null;
  usableArea?: number | null;
  landArea?: number | null;
  address?: string;
  imageUrl?: string;
}

export default function PropertyCard({
  id,
  slug,
  title,
  propertyType,
  price,
  priceType = "de_la",
  priceSuffix = "€",
  status,
  bedrooms,
  bathrooms,
  rooms,
  usableArea,
  landArea,
  address = "Hereclean, Sălaj",
  imageUrl = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
}: PropertyCardProps) {
  const { openBooking } = useBookingModal();

  const formattedPrice = price.toLocaleString("ro-RO");
  const pricePrefixText = priceType === "de_la" ? "De la" : "";
  const isLand = propertyType.toUpperCase().includes("TEREN");

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-[#C5A467]/25 hover:border-[#C5A467]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* 1. Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Dark contrast gradient overlay at bottom for crystal-clear price readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#FAFAF8]/95 text-[#181818] backdrop-blur-md border border-[#C5A467]/30 shadow-xs">
            {status}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#181818]/85 text-[#D8BE83] backdrop-blur-md border border-white/10">
            {propertyType}
          </span>
        </div>

        {/* Price on Image Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          {pricePrefixText && (
            <span className="text-[10px] uppercase tracking-widest text-[#D8BE83] font-semibold block drop-shadow-sm">
              {pricePrefixText}
            </span>
          )}
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wide text-white drop-shadow-md">
            {formattedPrice} {priceSuffix}
          </span>
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#707070] h-5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
            <span className="truncate">{address}</span>
          </div>

          {/* Title with standardized height so all cards align */}
          <h3 className="font-serif text-lg sm:text-xl font-medium text-[#181818] group-hover:text-[#967542] transition-colors leading-snug min-h-[3.25rem] flex items-center">
            {title}
          </h3>

          {/* Standardized Specs Grid (exact same height on all cards) */}
          <div className="py-3 my-3 border-y border-[#C5A467]/15 text-xs text-[#707070] min-h-[86px] flex flex-col justify-center space-y-2">
            {!isLand ? (
              <>
                <div className="grid grid-cols-3 gap-1">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
                    <span>
                      <strong className="text-[#181818] font-semibold">{usableArea || 120}</strong> m² util
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
                    <span>
                      <strong className="text-[#181818] font-semibold">{rooms || 4}</strong> cam.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
                    <span>
                      <strong className="text-[#181818] font-semibold">{bathrooms || 2}</strong> {bathrooms === 1 ? "baie" : "băi"}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#707070] pt-0.5 truncate">
                  Curte privată / Teren: <strong className="text-[#181818]">{landArea || 500} m²</strong>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-1">
                  <div className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
                    <span>
                      <strong className="text-[#181818] font-semibold">{landArea || 750}</strong> m²
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
                    <span>
                      <strong className="text-[#181818] font-semibold">22m</strong> front
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#C5A467] flex-shrink-0" />
                    <span>Intravilan</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#707070] pt-0.5 truncate">
                  Acces asfaltat DC12 • Toate utilitățile
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Actions (Stacked cleanly with zero truncation) */}
        <div className="space-y-2 pt-2 mt-auto">
          <Link
            href={`/proprietati/${slug}`}
            className="w-full py-2.5 px-4 rounded-xl border border-[#C5A467]/40 hover:border-[#C5A467] text-[#181818] hover:bg-[#C5A467]/10 text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Vezi proprietatea</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#967542]" />
          </Link>

          <button
            onClick={() => openBooking(id, title)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs hover:shadow-md flex items-center justify-center gap-2 gold-btn-pulse"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Programează vizită</span>
          </button>
        </div>
      </div>
    </div>
  );
}
