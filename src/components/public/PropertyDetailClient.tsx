"use client";

import React, { useState } from "react";
import { Phone, Calendar, Maximize2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Lightbox from "./Lightbox";
import { useBookingModal } from "./BookingContext";

interface PropertyImage {
  id: string;
  url: string;
  caption?: string | null;
}

interface PropertyDetailClientProps {
  propertyId: string;
  propertyTitle: string;
  priceFormatted: string;
  status: string;
  images: PropertyImage[];
  facilities: string[];
}

export default function PropertyDetailClient({
  propertyId,
  propertyTitle,
  priceFormatted,
  status,
  images,
  facilities,
}: PropertyDetailClientProps) {
  const { openBooking } = useBookingModal();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <>
      {/* 1. Large Interactive Gallery */}
      <div className="space-y-3">
        {/* Main Large Image */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative h-80 sm:h-[480px] lg:h-[540px] w-full rounded-3xl overflow-hidden cursor-pointer group border border-[#C5A467]/30 shadow-md bg-gray-100"
        >
          {currentImage ? (
            <img
              src={currentImage.url}
              alt={currentImage.caption || propertyTitle}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : null}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

          {/* Zoom button on hover */}
          <div className="absolute bottom-6 right-6 p-3 rounded-full bg-white/25 backdrop-blur-md text-white border border-white/20 opacity-90 group-hover:scale-110 transition-transform">
            <Maximize2 className="w-5 h-5" />
          </div>

          {/* Current caption */}
          {currentImage?.caption && (
            <div className="absolute bottom-6 left-6 max-w-md bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs">
              {currentImage.caption}
            </div>
          )}
        </div>

        {/* Thumbnail row */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? "border-[#C5A467] scale-105 shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Facilities Grid */}
      {facilities && facilities.length > 0 && (
        <div className="mt-12 pt-8 border-t border-[#C5A467]/20">
          <h3 className="font-serif text-2xl font-medium text-[#181818] mb-6">
            Dotări & Facilități Incluse
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {facilities.map((fac, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#C5A467]/20 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-[#C5A467]/15 flex items-center justify-center text-[#967542] flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-[#181818] font-medium">{fac}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sticky Bottom CTA Bar (Desktop & Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAFAF8]/95 backdrop-blur-md border-t border-[#C5A467]/30 py-3.5 px-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block">
            <span className="text-[10px] uppercase tracking-widest text-[#967542] font-semibold block">
              DISPONIBILITATE IMOBIL • {status}
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="font-serif font-semibold text-lg text-[#181818]">{propertyTitle}</h4>
              <span className="text-sm font-semibold text-[#967542] font-mono">{priceFormatted}</span>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <a
              href="tel:0740123456"
              className="flex-1 sm:flex-none px-6 py-3 rounded-full border border-[#C5A467] text-[#181818] hover:bg-[#C5A467]/10 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#967542]" />
              <span>Sună acum</span>
            </a>

            <button
              onClick={() => openBooking(propertyId, propertyTitle)}
              className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-[#C5A467] hover:bg-[#967542] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 gold-btn-pulse"
            >
              <Calendar className="w-4 h-4" />
              <span>Programează vizită</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={activeImageIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
