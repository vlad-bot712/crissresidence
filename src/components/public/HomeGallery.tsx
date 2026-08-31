"use client";

import React, { useState } from "react";
import Lightbox from "./Lightbox";
import { Maximize2 } from "lucide-react";

interface GalleryImage {
  url: string;
  caption: string;
  subtitle: string;
  size: "large" | "medium" | "tall" | "wide";
}

const galleryPhotos: GalleryImage[] = [
  {
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
    caption: "Fațadă principală — Geometrie modernă și volume armonioase",
    subtitle: "Exterior & Curte",
    size: "large",
  },
  {
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=85",
    caption: "Curte privată și zonă de relaxare în aer liber",
    subtitle: "Peisagistică",
    size: "tall",
  },
  {
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
    caption: "Living room generos cu suprafețe vitrate generoase și multă lumină naturală",
    subtitle: "Interior Design",
    size: "wide",
  },
  {
    url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85",
    caption: "Zonă de dining deschisă spre bucătărie modernă",
    subtitle: "Open Space",
    size: "medium",
  },
  {
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
    caption: "Stadiu de construcție la roșu — Calitatea zidăriei și a acoperișului",
    subtitle: "Structură & Durabilitate",
    size: "tall",
  },
  {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
    caption: "Vedere aeriană asupra reliefului din Hereclean",
    subtitle: "Cadru Natural",
    size: "wide",
  },
];

export default function HomeGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openPhoto = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
        {/* Photo 1 (Big Featured - 7 cols) */}
        <div
          onClick={() => openPhoto(0)}
          className="md:col-span-7 group relative h-80 md:h-[480px] rounded-3xl overflow-hidden cursor-pointer border border-[#C5A467]/20 shadow-sm"
        >
          <img
            src={galleryPhotos[0].url}
            alt={galleryPhotos[0].caption}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D8BE83] font-semibold">
                {galleryPhotos[0].subtitle}
              </span>
              <h4 className="font-serif text-lg md:text-xl font-medium mt-1">
                {galleryPhotos[0].caption}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Photo 2 (Tall - 5 cols) */}
        <div
          onClick={() => openPhoto(1)}
          className="md:col-span-5 group relative h-80 md:h-[480px] rounded-3xl overflow-hidden cursor-pointer border border-[#C5A467]/20 shadow-sm"
        >
          <img
            src={galleryPhotos[1].url}
            alt={galleryPhotos[1].caption}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D8BE83] font-semibold">
                {galleryPhotos[1].subtitle}
              </span>
              <h4 className="font-serif text-base md:text-lg font-medium mt-1">
                {galleryPhotos[1].caption}
              </h4>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Photo 3 (Medium - 4 cols) */}
        <div
          onClick={() => openPhoto(2)}
          className="md:col-span-4 group relative h-64 md:h-[340px] rounded-3xl overflow-hidden cursor-pointer border border-[#C5A467]/20 shadow-sm"
        >
          <img
            src={galleryPhotos[2].url}
            alt={galleryPhotos[2].caption}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[9px] uppercase tracking-widest text-[#D8BE83] font-semibold">
              {galleryPhotos[2].subtitle}
            </span>
            <h4 className="font-serif text-sm font-medium mt-0.5">
              {galleryPhotos[2].caption}
            </h4>
          </div>
        </div>

        {/* Photo 4 (Medium - 4 cols) */}
        <div
          onClick={() => openPhoto(3)}
          className="md:col-span-4 group relative h-64 md:h-[340px] rounded-3xl overflow-hidden cursor-pointer border border-[#C5A467]/20 shadow-sm"
        >
          <img
            src={galleryPhotos[3].url}
            alt={galleryPhotos[3].caption}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[9px] uppercase tracking-widest text-[#D8BE83] font-semibold">
              {galleryPhotos[3].subtitle}
            </span>
            <h4 className="font-serif text-sm font-medium mt-0.5">
              {galleryPhotos[3].caption}
            </h4>
          </div>
        </div>

        {/* Photo 5 (Medium - 4 cols) */}
        <div
          onClick={() => openPhoto(4)}
          className="md:col-span-4 group relative h-64 md:h-[340px] rounded-3xl overflow-hidden cursor-pointer border border-[#C5A467]/20 shadow-sm"
        >
          <img
            src={galleryPhotos[4].url}
            alt={galleryPhotos[4].caption}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[9px] uppercase tracking-widest text-[#D8BE83] font-semibold">
              {galleryPhotos[4].subtitle}
            </span>
            <h4 className="font-serif text-sm font-medium mt-0.5">
              {galleryPhotos[4].caption}
            </h4>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          images={galleryPhotos}
          initialIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
