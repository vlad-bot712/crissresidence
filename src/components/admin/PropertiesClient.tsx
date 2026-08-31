"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  Home,
  Image as ImageIcon,
  DollarSign,
  Loader2,
  Sparkles,
} from "lucide-react";

export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  priceType: string;
  priceSuffix?: string | null;
  status: string;
  propertyType: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rooms?: number | null;
  usableArea?: number | null;
  builtArea?: number | null;
  landArea?: number | null;
  floors?: string | null;
  parking?: string | null;
  utilities?: string | null;
  constructionStage?: string | null;
  completionDate?: string | null;
  address: string;
  isHidden: boolean;
  facilities: string; // JSON
  images: {
    id?: string;
    url: string;
    caption?: string | null;
    isPrimary?: boolean;
    order?: number;
  }[];
}

interface PropertiesClientProps {
  initialProperties: PropertyItem[];
}

export default function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const [properties, setProperties] = useState<PropertyItem[]>(initialProperties);
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [priceType, setPriceType] = useState("de_la");
  const [priceSuffix, setPriceSuffix] = useState("€");
  const [status, setStatus] = useState("Disponibilă");
  const [propertyType, setPropertyType] = useState("CASĂ");
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [rooms, setRooms] = useState<number>(4);
  const [usableArea, setUsableArea] = useState<number>(120);
  const [builtArea, setBuiltArea] = useState<number>(150);
  const [landArea, setLandArea] = useState<number>(500);
  const [floors, setFloors] = useState("Parter + Mansardă");
  const [parking, setParking] = useState("2 locuri");
  const [utilities, setUtilities] = useState("Apă, Canalizare, Curent, Gaz");
  const [constructionStage, setConstructionStage] = useState("La Roșu");
  const [completionDate, setCompletionDate] = useState("Trimestrul IV 2026");
  const [address, setAddress] = useState("Hereclean 35/A, DC12, Hereclean, Sălaj");
  const [images, setImages] = useState<{ url: string; caption?: string }[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [newFacility, setNewFacility] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const statuses = [
    "Disponibilă",
    "În proiect",
    "În construcție",
    "Rezervată",
    "Vândută",
    "În curând",
  ];

  const refreshProperties = async () => {
    try {
      const res = await fetch("/api/admin/properties");
      const data = await res.json();
      if (Array.isArray(data)) setProperties(data);
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setIsNew(true);
    setTitle("");
    setDescription("");
    setPrice(89000);
    setPriceType("de_la");
    setPriceSuffix("€");
    setStatus("Disponibilă");
    setPropertyType("CASĂ");
    setBedrooms(3);
    setBathrooms(2);
    setRooms(4);
    setUsableArea(120);
    setBuiltArea(150);
    setLandArea(500);
    setFloors("Parter + Etaj");
    setParking("2 locuri");
    setUtilities("Apă, Canalizare, Curent, Gaz");
    setConstructionStage("În construcție");
    setCompletionDate("Trimestrul IV 2026");
    setAddress("Hereclean 35/A, DC12, Hereclean, Sălaj");
    setImages([
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
        caption: "Fațadă principală",
      },
    ]);
    setFacilities([
      "Curte proprie",
      "Încălzire în pardoseală",
      "Geamuri tripan termoizolante",
      "Izolație vată bazaltică",
      "Acces asfaltat",
      "Utilități complete",
    ]);
    setEditingProperty({} as PropertyItem);
  };

  const openEditModal = (p: PropertyItem) => {
    setIsNew(false);
    setEditingProperty(p);
    setTitle(p.title);
    setDescription(p.description);
    setPrice(p.price);
    setPriceType(p.priceType);
    setPriceSuffix(p.priceSuffix || "€");
    setStatus(p.status);
    setPropertyType(p.propertyType);
    setBedrooms(p.bedrooms || 0);
    setBathrooms(p.bathrooms || 0);
    setRooms(p.rooms || 0);
    setUsableArea(p.usableArea || 0);
    setBuiltArea(p.builtArea || 0);
    setLandArea(p.landArea || 0);
    setFloors(p.floors || "");
    setParking(p.parking || "");
    setUtilities(p.utilities || "");
    setConstructionStage(p.constructionStage || "");
    setCompletionDate(p.completionDate || "");
    setAddress(p.address || "Hereclean 35/A, DC12, Hereclean, Sălaj");
    setImages(p.images.map((img) => ({ url: img.url, caption: img.caption || "" })));

    let parsedFac: string[] = [];
    try {
      parsedFac = JSON.parse(p.facilities || "[]");
    } catch {}
    setFacilities(parsedFac);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      id: isNew ? undefined : editingProperty?.id,
      title,
      description,
      price,
      priceType,
      priceSuffix,
      status,
      propertyType,
      bedrooms,
      bathrooms,
      rooms,
      usableArea,
      builtArea,
      landArea,
      floors,
      parking,
      utilities,
      constructionStage,
      completionDate,
      address,
      facilities,
      images,
    };

    try {
      const res = await fetch("/api/admin/properties", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setEditingProperty(null);
        await refreshProperties();
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleHide = async (p: PropertyItem) => {
    try {
      await fetch("/api/admin/properties", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, isHidden: !p.isHidden }),
      });
      refreshProperties();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur doriți să ștergeți această proprietate?")) return;
    try {
      await fetch(`/api/admin/properties?id=${id}`, { method: "DELETE" });
      refreshProperties();
    } catch (e) {
      console.error(e);
    }
  };

  const addFacility = () => {
    if (!newFacility.trim()) return;
    setFacilities([...facilities, newFacility.trim()]);
    setNewFacility("");
  };

  const removeFacility = (idx: number) => {
    setFacilities(facilities.filter((_, i) => i !== idx));
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, { url: newImageUrl.trim(), caption: "Fotografie nouă" }]);
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C5A467]/20 pb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#967542] font-semibold">
            CATALOG IMOBILIAR
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-[#181818]">
            Management Proprietăți
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="py-3 px-5 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Adaugă proprietate</span>
        </button>
      </div>

      {/* Grid of properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => {
          const primaryImg = p.images.find((img) => img.isPrimary) || p.images[0];
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                p.isHidden ? "opacity-60 border-gray-300" : "border-[#C5A467]/30 shadow-2xs"
              }`}
            >
              <div>
                <div className="relative h-48 w-full bg-gray-100">
                  {primaryImg ? (
                    <img
                      src={primaryImg.url}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-[#181818] shadow-xs">
                      {p.status}
                    </span>
                    {p.isHidden && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-800 text-white">
                        Ascunsă
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-semibold text-[#967542] uppercase tracking-wider">
                    {p.propertyType}
                  </span>
                  <h3 className="font-serif font-semibold text-lg text-[#181818] leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-sm font-bold text-[#181818] font-mono">
                    {p.priceType === "de_la" ? "De la " : ""}
                    {p.price.toLocaleString("ro-RO")} {p.priceSuffix || "€"}
                  </p>
                  <p className="text-xs text-[#707070] line-clamp-2">{p.description}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-2 border-t border-[#C5A467]/15 flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#C5A467]/40 hover:bg-[#C5A467]/10 text-xs font-semibold text-[#181818] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#967542]" />
                  <span>Editează</span>
                </button>

                <button
                  onClick={() => handleToggleHide(p)}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-[#707070] transition-colors"
                  title={p.isHidden ? "Afișează pe site" : "Ascunde de pe site"}
                >
                  {p.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                  title="Șterge"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-[#C5A467]/30 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            <div className="px-6 py-4 border-b border-[#C5A467]/20 flex items-center justify-between bg-[#FAFAF8]">
              <h3 className="font-serif text-xl font-semibold text-[#181818]">
                {isNew ? "Adaugă Proprietate Nouă" : `Editare: ${title}`}
              </h3>
              <button
                onClick={() => setEditingProperty(null)}
                className="p-2 text-[#707070] hover:text-[#181818] rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Titlu Proprietate *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Tip Proprietate
                  </label>
                  <input
                    type="text"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    placeholder="CASĂ LA PROIECT / ROȘU / CHEIE / TEREN"
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Preț Valoare *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#707070] uppercase mb-1">
                      Tip Preț
                    </label>
                    <select
                      value={priceType}
                      onChange={(e) => setPriceType(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                    >
                      <option value="de_la">De la</option>
                      <option value="fix">Fix</option>
                      <option value="pe_mp">Pe m²</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#707070] uppercase mb-1">
                      Sufix
                    </label>
                    <input
                      type="text"
                      value={priceSuffix}
                      onChange={(e) => setPriceSuffix(e.target.value)}
                      className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Descriere Detaliată *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Suprafață utilă (m²)
                  </label>
                  <input
                    type="number"
                    value={usableArea}
                    onChange={(e) => setUsableArea(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Suprafață teren (m²)
                  </label>
                  <input
                    type="number"
                    value={landArea}
                    onChange={(e) => setLandArea(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-[#707070] uppercase mb-1">
                      Camere
                    </label>
                    <input
                      type="number"
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#707070] uppercase mb-1">
                      Dormitoare
                    </label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#707070] uppercase mb-1">
                      Băi
                    </label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Stadiu Construcție
                  </label>
                  <input
                    type="text"
                    value={constructionStage}
                    onChange={(e) => setConstructionStage(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Termen Finalizare
                  </label>
                  <input
                    type="text"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#707070] uppercase mb-1">
                    Utilități
                  </label>
                  <input
                    type="text"
                    value={utilities}
                    onChange={(e) => setUtilities(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#C5A467]/30 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Facilities Editor */}
              <div className="pt-3 border-t border-[#C5A467]/20 space-y-2">
                <label className="block font-semibold text-[#707070] uppercase">
                  Facilități & Dotări
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adaugă dotare (ex: Încălzire în pardoseală)..."
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="flex-1 p-2 bg-white border border-[#C5A467]/30 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="px-4 py-2 rounded-xl bg-[#C5A467] text-white font-semibold"
                  >
                    Adaugă
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-[#FAFAF8] border border-[#C5A467]/30 text-[#181818] flex items-center gap-1.5"
                    >
                      <span>{fac}</span>
                      <button
                        type="button"
                        onClick={() => removeFacility(idx)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images Editor */}
              <div className="pt-3 border-t border-[#C5A467]/20 space-y-2">
                <label className="block font-semibold text-[#707070] uppercase">
                  Fotografii & Randări (URL-uri)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 p-2 bg-white border border-[#C5A467]/30 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 rounded-xl bg-[#C5A467] text-white font-semibold"
                  >
                    Adaugă Foto
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 rounded-xl overflow-hidden border border-[#C5A467]/30 group"
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#C5A467]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-[#707070] hover:bg-gray-100"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#C5A467] hover:bg-[#967542] text-white font-semibold flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Salvează Proprietatea</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
