import React from "react";
import prisma from "@/lib/db";
import PropertyCard from "@/components/public/PropertyCard";
import CTAButton from "@/components/public/CTAButton";
import { ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Proprietăți Disponibile",
  description:
    "Descoperiți casele și parcelele de teren disponibile în Hereclean, Sălaj. Construcții la proiect, la roșu sau la cheie.",
};

export const revalidate = 60;

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    where: { isHidden: false },
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-[#FAFAF8] text-[#181818] min-h-screen pt-28 md:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Editorial */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A467]/10 border border-[#C5A467]/30 text-[#967542] text-[11px] font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTOFOLIU REZIDENȚIAL HERECLEAN</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#181818] leading-tight">
            Proprietăți & Parcele
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#707070] leading-relaxed">
            Locuințe contemporane proiectate cu atenție pentru fiecare detaliu. Alegeți stadiul de execuție potrivit
            nevoilor și bugetului dumneavoastră sau optați pentru o parcelă de teren dedicată construirii casei de vis.
          </p>
        </div>

        {/* Informative Guarantee Banner */}
        <div className="mb-12 p-6 rounded-2xl bg-white border border-[#C5A467]/20 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C5A467]/10 border border-[#C5A467]/30 flex items-center justify-center text-[#967542] flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-semibold text-base text-[#181818]">
                Transparență & Garanție de Construcție
              </h4>
              <p className="text-xs text-[#707070] mt-0.5">
                Toate imobilele beneficiază de documentație tehnică completă, certificat energetic și garanție
                structurală conform legislației în vigoare.
              </p>
            </div>
          </div>

          <CTAButton
            text="Programează o vizionare"
            className="text-xs py-3 px-6 whitespace-nowrap"
          />
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
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

        {/* Bottom Consultation CTA */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-[#FFFFFF] border border-[#C5A467]/30 shadow-sm text-center max-w-3xl mx-auto space-y-4">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#967542]">
            DORIȚI CONSULTANȚĂ PERSONALIZATĂ?
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-[#181818] font-medium">
            Nu ați găsit configurația dorită?
          </h3>
          <p className="text-xs md:text-sm text-[#707070] max-w-lg mx-auto leading-relaxed">
            Dezvoltăm proiecte adaptate și putem discuta variante de compartimentare sau loturi adiționale direct la
            biroul nostru din Hereclean.
          </p>
          <div className="pt-2 flex justify-center">
            <CTAButton text="Discută cu un dezvoltator" className="py-3 px-8 text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
