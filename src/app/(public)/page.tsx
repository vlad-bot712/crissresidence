import React from "react";
import Link from "next/link";
import prisma from "@/lib/db";
import PropertyCard from "@/components/public/PropertyCard";
import HomeGallery from "@/components/public/HomeGallery";
import HeroButtons from "@/components/public/HeroButtons";
import CTAButton from "@/components/public/CTAButton";
import { ArrowDown, Check, ArrowRight } from "lucide-react";

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  // Fetch properties from database
  const properties = await prisma.property.findMany({
    where: { isHidden: false },
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-[#FAFAF8] text-[#181818] overflow-hidden">
      {/* 1. HERO SECTION (approx 90vh) */}
      <section className="relative min-h-[90vh] md:h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
            alt="Criss Residence Hereclean"
            className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
          />
          {/* Subtle dark luxury gradient overlay for maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/50" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-20">
          {/* Luxury Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D8BE83]/40 bg-black/30 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D8BE83]" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-[#D8BE83] font-medium">
              HERECLEAN • SĂLAJ • CONSTRUCȚII REZIDENȚIALE
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white max-w-4xl mx-auto leading-[1.12] drop-shadow-sm">
            Acasă începe cu locul potrivit.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto font-light leading-relaxed">
            Locuințe moderne construite în Hereclean pentru familiile care își doresc mai mult decât o casă.
          </p>

          {/* Buttons */}
          <div className="flex justify-center">
            <HeroButtons />
          </div>

          {/* Elegant Scroll Indicator */}
          <div className="mt-12 md:mt-16 flex flex-col items-center gap-2 text-white/60 animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.25em]">Scroll to explore</span>
            <ArrowDown className="w-4 h-4 text-[#D8BE83]" />
          </div>
        </div>
      </section>

      {/* 2. SECTION — PREZENTARE EDITORIALĂ */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Left */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
                FILOZOFIA NOASTRĂ
              </span>
              <div className="w-8 h-[1.5px] bg-[#C5A467] mt-1.5" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181818] leading-[1.2]">
              Construim locuri în care să trăiești.
            </h2>

            <p className="text-[#707070] text-base md:text-lg leading-relaxed font-normal">
              Fiecare casă realizată de Criss Residence în Hereclean este gândită ca un refugiu de liniște și
              eleganță, adaptat cerințelor vieții contemporane. Îmbinăm arhitectura curată cu materiale durabile și
              compartimentări funcționale.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#C5A467]/20 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#967542] block">
                  Materiale Premium
                </span>
                <p className="text-xs text-[#707070] mt-1">
                  Cărămidă termoizolantă, beton certificat și geamuri tripan performante.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#C5A467]/20 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#967542] block">
                  Stadii Flexibile
                </span>
                <p className="text-xs text-[#707070] mt-1">
                  Disponibilitate la proiect, la roșu sau la cheie cu finisaje personalizate.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#C5A467]/20 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#967542] block">
                  Curte & Teren Generos
                </span>
                <p className="text-xs text-[#707070] mt-1">
                  Parcele ample de 500 – 750 m² pentru intimitate și spațiu verde.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#C5A467]/20 shadow-2xs">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#967542] block">
                  Acces Facil Zalău
                </span>
                <p className="text-xs text-[#707070] mt-1">
                  Doar 7 minute pe drum asfaltat direct din Hereclean spre oraș.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/proprietati"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#967542] hover:text-[#181818] transition-colors group"
              >
                <span>Descoperă stadiile de execuție</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Large Architectural Photo Right */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#C5A467]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85"
                alt="Arhitectură Criss Residence Hereclean"
                className="w-full h-[420px] sm:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating Architectural Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#FAFAF8]/95 backdrop-blur-md p-5 rounded-2xl border border-[#C5A467]/30">
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#967542] block">
                  LOCAȚIE EXCLUSIVĂ
                </span>
                <p className="font-serif text-lg font-medium text-[#181818] mt-0.5">
                  Hereclean 35/A, DC12, Județul Sălaj
                </p>
                <p className="text-xs text-[#707070] mt-1">
                  Cadru natural protejat, aer curat și comunitate rezidențială selectă.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION — GALERIE CASE (Editorial Asymmetric & Lightbox) */}
      <section className="py-20 md:py-28 bg-[#FFFFFF] border-y border-[#C5A467]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
              PORTFOLIU VIZUAL
            </span>
            <div className="w-8 h-[1.5px] bg-[#C5A467] mt-1.5 mb-3" />
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181818]">
              Galerie Arhitecturală
            </h2>
            <p className="text-sm md:text-base text-[#707070] mt-2">
              Explorați detaliile exterioare, fațadele moderne, stadiul structurilor și generozitatea spațiilor
              interioare. Apăsați pe orice imagine pentru deschidere în galerie completă.
            </p>
          </div>

          <HomeGallery />
        </div>
      </section>

      {/* 4. SECTION — DE CE NOI (4 Minimalist Benefits) */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542]">
            STANDARDE ȘI VALORI
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181818] mt-2">
            De ce să alegi Criss Residence?
          </h2>
          <div className="w-12 h-[1.5px] bg-[#C5A467] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 01 */}
          <div className="border-t border-[#C5A467]/40 pt-6 space-y-3">
            <span className="font-serif text-3xl md:text-4xl text-[#C5A467] font-semibold block">
              01
            </span>
            <h3 className="font-serif text-xl font-medium text-[#181818]">
              Construcție modernă
            </h3>
            <p className="text-xs sm:text-sm text-[#707070] leading-relaxed">
              Arhitectură contemporană europeană, orientare solară ideală, ferestre înalte și finisaje cu linii
              curate fără compromisuri.
            </p>
          </div>

          {/* 02 */}
          <div className="border-t border-[#C5A467]/40 pt-6 space-y-3">
            <span className="font-serif text-3xl md:text-4xl text-[#C5A467] font-semibold block">
              02
            </span>
            <h3 className="font-serif text-xl font-medium text-[#181818]">
              Materiale atent selectate
            </h3>
            <p className="text-xs sm:text-sm text-[#707070] leading-relaxed">
              Cărămidă termoizolantă Porotherm, acoperișuri durabile din tablă fălțuită antracit și instalații
              executate după norme stricte.
            </p>
          </div>

          {/* 03 */}
          <div className="border-t border-[#C5A467]/40 pt-6 space-y-3">
            <span className="font-serif text-3xl md:text-4xl text-[#C5A467] font-semibold block">
              03
            </span>
            <h3 className="font-serif text-xl font-medium text-[#181818]">
              Locație liniștită
            </h3>
            <p className="text-xs sm:text-sm text-[#707070] leading-relaxed">
              Hereclean oferă intimitatea dorită pentru o familie, aer curat, priveliște neobstrucționată și drum
              asfaltat cu acces rapid spre oraș.
            </p>
          </div>

          {/* 04 */}
          <div className="border-t border-[#C5A467]/40 pt-6 space-y-3">
            <span className="font-serif text-3xl md:text-4xl text-[#C5A467] font-semibold block">
              04
            </span>
            <h3 className="font-serif text-xl font-medium text-[#181818]">
              Flexibilitate în stadiu
            </h3>
            <p className="text-xs sm:text-sm text-[#707070] leading-relaxed">
              Poți cumpăra din faza de proiect pentru personalizare totală, la roșu pentru ritm propriu de
              amenajare, sau complet finalizată la cheie.
            </p>
          </div>
        </div>
      </section>

      {/* 5. SECTION — PROPRIETĂȚI PREVIEW (Cele 4 Categorii) */}
      <section className="py-20 md:py-28 bg-[#FFFFFF] border-t border-[#C5A467]/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
                DISPONIBILITĂȚI REZIDENȚIALE
              </span>
              <div className="w-8 h-[1.5px] bg-[#C5A467] mt-1.5 mb-2" />
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181818]">
                Opțiuni de Locuire & Teren
              </h2>
            </div>
            <Link
              href="/proprietati"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#967542] hover:text-[#181818] transition-colors"
            >
              <span>Vezi toate specificațiile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((p) => {
              const primaryImg = p.images.find((img) => img.isPrimary) || p.images[0];
              return (
                <PropertyCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  title={p.title}
                  propertyType={p.propertyType}
                  price={p.price}
                  priceType={p.priceType}
                  priceSuffix={p.priceSuffix}
                  status={p.status}
                  bedrooms={p.bedrooms}
                  bathrooms={p.bathrooms}
                  rooms={p.rooms}
                  usableArea={p.usableArea}
                  landArea={p.landArea}
                  address={p.address}
                  imageUrl={primaryImg?.url}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. SECTION CTA */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85"
            alt="Vedere Vila Hereclean"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#D8BE83] font-semibold block">
            EXPERIENȚĂ PERSONALIZATĂ PE ȘANTIER
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal leading-tight text-white max-w-2xl mx-auto">
            Vezi casa înainte să iei decizia.
          </h2>

          <p className="text-sm md:text-base text-white/80 max-w-xl mx-auto font-light leading-relaxed">
            Te invităm la o vizită privată în Hereclean pentru a simți spațiul, a verifica structura și a discuta
            direct stadiul și opțiunile de personalizare.
          </p>

          <div className="pt-4 flex justify-center">
            <CTAButton text="Programează o vizită" className="text-sm py-4 px-10" />
          </div>
        </div>
      </section>
    </div>
  );
}
