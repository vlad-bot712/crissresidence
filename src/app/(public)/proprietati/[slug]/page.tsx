import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import PropertyDetailClient from "@/components/public/PropertyDetailClient";
import {
  Home,
  Bed,
  Bath,
  Layers,
  Car,
  Zap,
  CalendarDays,
  ShieldAlert,
  MapPin,
  FileText,
  Compass,
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
  });

  if (!property) return { title: "Proprietate Negăsită" };

  return {
    title: `${property.title} | Criss Residence Hereclean`,
    description: property.description.slice(0, 160),
  };
}

export const revalidate = 60;

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!property) {
    notFound();
  }

  let facilitiesList: string[] = [];
  try {
    facilitiesList = JSON.parse(property.facilities || "[]");
  } catch {}

  const formattedPrice = `${property.priceType === "de_la" ? "De la " : ""}${property.price.toLocaleString(
    "ro-RO"
  )} ${property.priceSuffix || "€"}`;

  return (
    <div className="bg-[#FAFAF8] text-[#181818] min-h-screen pt-28 md:pt-36 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Breadcrumb & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#707070]">
            <a href="/" className="hover:text-[#181818]">
              Acasă
            </a>
            <span>/</span>
            <a href="/proprietati" className="hover:text-[#181818]">
              Proprietăți
            </a>
            <span>/</span>
            <span className="text-[#967542] font-semibold">{property.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#FAFAF8] text-[#181818] border border-[#C5A467]/30 shadow-2xs">
              {property.status}
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#181818] text-[#D8BE83]">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* Title & Price Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-[#C5A467]/20">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#181818] leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#707070]">
              <MapPin className="w-4 h-4 text-[#C5A467]" />
              <span>{property.address}</span>
            </div>
          </div>

          <div className="lg:text-right">
            <span className="text-xs uppercase tracking-widest text-[#707070] block">
              Preț de achiziție
            </span>
            <span className="font-serif text-3xl sm:text-4xl font-semibold text-[#967542]">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* Large Gallery & Lightbox */}
        <PropertyDetailClient
          propertyId={property.id}
          propertyTitle={property.title}
          priceFormatted={formattedPrice}
          status={property.status}
          images={property.images}
          facilities={facilitiesList}
        />

        {/* Content Columns: Description & Technical Specs */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Description & Construction Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="font-serif text-2xl font-medium text-[#181818] mb-4">
                Despre această proprietate
              </h2>
              <p className="text-base text-[#404040] leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Stage and Architecture highlights */}
            <div className="p-6 rounded-2xl bg-white border border-[#C5A467]/25 shadow-2xs space-y-4">
              <h3 className="font-serif text-lg font-medium text-[#181818] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C5A467]" />
                <span>Stadiul Construcției & Termen</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#707070]">
                <div>
                  <span className="block font-semibold text-[#181818]">Fază Curentă:</span>
                  <span className="text-sm text-[#967542] font-medium">
                    {property.constructionStage || "În desfășurare conform grafic"}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-[#181818]">Termen Finalizare:</span>
                  <span className="text-sm text-[#967542] font-medium">
                    {property.completionDate || "Disponibil imediat"}
                  </span>
                </div>
              </div>
            </div>

            {/* Floor Plan / Concept Illustration Box */}
            <div className="p-6 rounded-2xl bg-white border border-[#C5A467]/25 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium text-[#181818] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C5A467]" />
                  <span>Documentație & Plan Arhitectural</span>
                </h3>
              </div>
              <p className="text-xs text-[#707070] leading-relaxed">
                Releveu tehnic, cartea construcției, autorizația de construire și planul de compartimentare pe niveluri
                sunt disponibile la sediu și vă pot fi prezentate în cadrul vizitei de consultanță.
              </p>
            </div>
          </div>

          {/* Right Column: Technical Specs Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-[#C5A467]/30 shadow-md space-y-6">
              <div className="border-b border-[#C5A467]/20 pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542] block">
                  FIȘĂ TEHNICĂ
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#181818] mt-1">
                  Specificații Imobil
                </h3>
              </div>

              <div className="divide-y divide-[#C5A467]/15 text-xs sm:text-sm">
                {property.usableArea && property.usableArea > 0 ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#C5A467]" /> Suprafață utilă:
                    </span>
                    <strong className="text-[#181818]">{property.usableArea} m²</strong>
                  </div>
                ) : null}

                {property.builtArea && property.builtArea > 0 ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#C5A467]" /> Suprafață construită:
                    </span>
                    <strong className="text-[#181818]">{property.builtArea} m²</strong>
                  </div>
                ) : null}

                {property.landArea && property.landArea > 0 ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#C5A467]" /> Suprafață teren / curte:
                    </span>
                    <strong className="text-[#181818]">{property.landArea} m²</strong>
                  </div>
                ) : null}

                {property.rooms && property.rooms > 0 ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C5A467]" /> Număr camere:
                    </span>
                    <strong className="text-[#181818]">{property.rooms} camere</strong>
                  </div>
                ) : null}

                {property.bedrooms && property.bedrooms > 0 ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Bed className="w-4 h-4 text-[#C5A467]" /> Dormitoare:
                    </span>
                    <strong className="text-[#181818]">{property.bedrooms} dormitoare</strong>
                  </div>
                ) : null}

                {property.bathrooms && property.bathrooms > 0 ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Bath className="w-4 h-4 text-[#C5A467]" /> Băi:
                    </span>
                    <strong className="text-[#181818]">{property.bathrooms} băi</strong>
                  </div>
                ) : null}

                {property.floors ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#C5A467]" /> Regim înălțime:
                    </span>
                    <strong className="text-[#181818]">{property.floors}</strong>
                  </div>
                ) : null}

                {property.parking ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#C5A467]" /> Parcare:
                    </span>
                    <strong className="text-[#181818]">{property.parking}</strong>
                  </div>
                ) : null}

                {property.utilities ? (
                  <div className="py-3 flex items-center justify-between">
                    <span className="text-[#707070] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#C5A467]" /> Utilități:
                    </span>
                    <strong className="text-[#181818] text-right text-xs max-w-[200px]">
                      {property.utilities}
                    </strong>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
