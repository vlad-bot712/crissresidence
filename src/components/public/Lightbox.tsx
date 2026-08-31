"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: { url: string; caption?: string | null }[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const prev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between text-white/80 z-10">
        <span className="text-xs uppercase tracking-widest font-mono text-[#D8BE83]">
          Fotografia {currentIndex + 1} din {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Închide galeria"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative flex-1 flex items-center justify-center my-4">
        {/* Prev button */}
        <button
          onClick={prev}
          className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/15 transition-all"
          aria-label="Fotografia precedentă"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center">
          <img
            src={current.url}
            alt={current.caption || "Fotografie Criss Residence"}
            className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
          />
        </div>

        {/* Next button */}
        <button
          onClick={next}
          className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-black/40 hover:bg-black/80 text-white border border-white/15 transition-all"
          aria-label="Fotografia următoare"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Caption footer */}
      <div className="text-center text-white/90 z-10 min-h-[32px]">
        {current.caption && (
          <p className="font-serif italic text-sm md:text-base text-white/80">
            {current.caption}
          </p>
        )}
      </div>
    </div>
  );
}
