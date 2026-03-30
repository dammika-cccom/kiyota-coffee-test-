"use client";

import { useActionState, useState, useMemo } from "react";
import { upsertProduct, ProductFormState } from "./actions";
import { PlusIcon, TrashIcon, GlobeIcon, AwardIcon, TruckIcon, MapPinIcon } from "@/components/ui/icons";
import Image from "next/image";
import type { lots, shippingRates } from "@/db/schema";

type Lot = typeof lots.$inferSelect;
type Rate = typeof shippingRates.$inferSelect;

export interface ProductData {
  id?: string;
  name?: string;
  description: string | null;
  priceLkr: string | null;
  priceUsd: string | null;
  pricingLogic: "MANUAL" | "AUTO_CONVERT" | null;
  displayMode: "LKR_ONLY" | "USD_ONLY" | "BOTH" | null;
  weightGrams: number;
  stockQuantity: number | null;
  category: "SPECIALTY_ARABICA" | "GREEN_BEANS" | "CEYLON_SPICES" | "EQUIPMENT" | "SAMPLE";
  imageUrls: string[] | null;
  isRetailEnabled: boolean | null;
  specifications: string | null;
}

export default function ProductEditor({ 
  initialData, 
  availableLots, 
  shippingRates 
}: { 
  initialData?: ProductData,
  availableLots: Lot[],
  shippingRates: Rate[]
}) {
  const [state, formAction, isPending] = useActionState(upsertProduct, {} as ProductFormState);
  const [images, setImages] = useState<string[]>(initialData?.imageUrls || []);
  const [currentWeight, setCurrentWeight] = useState(initialData?.weightGrams || 250);
  const [currentPrice, setCurrentPrice] = useState(Number(initialData?.priceLkr || 0));

  const landedCosts = useMemo(() => {
    return shippingRates.map(rate => {
      const grossWeightKg = Math.ceil((currentWeight * 1.1) / 1000);
      const base = Number(rate.firstKgRate || 0);
      const extra = Number(rate.additionalKgRate || 0);
      const shipCost = base + (Math.max(0, grossWeightKg - 1) * extra);
      return { region: rate.region, total: currentPrice + shipCost, shipping: shipCost };
    });
  }, [currentWeight, currentPrice, shippingRates]);

  const handleUpload = () => {
    const simulatedUrl = `https://res.cloudinary.com/demo/image/upload/v1312461204/sample_${Date.now()}.jpg`;
    setImages((prev) => [...prev, simulatedUrl]);
  };

  return (
    <form action={formAction} className="grid grid-cols-1 xl:grid-cols-4 gap-10 pb-20">
      <div className="xl:col-span-3 space-y-8">
        <section className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-stone-50 pb-4 mb-6">
            <AwardIcon className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-sm font-black uppercase tracking-widest text-[#2C1810]">Asset Profile</h3>
          </div>
          <input type="hidden" name="id" value={initialData?.id ?? ""} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-stone-400">Product Name</label>
                <input name="name" defaultValue={initialData?.name ?? undefined} className="kiyota-input w-full text-xl font-serif italic" required />
             </div>
             <div className="space-y-4 bg-[#FAF9F6] p-5 border border-stone-200 rounded-sm">
                <div className="flex items-center gap-2">
                   <MapPinIcon className="w-3 h-3 text-[#D4AF37]" />
                   <label className="text-[10px] font-black uppercase text-[#2C1810]">Active Lot Linker</label>
                </div>
                <select name="specifications" defaultValue={initialData?.specifications ?? ""} className="kiyota-input w-full bg-white text-xs">
                   <option value="">No Active Lot</option>
                   {availableLots.map(l => <option key={l.id} value={l.lotNumber}>{l.lotNumber}</option>)}
                </select>
             </div>
          </div>
          <textarea name="description" defaultValue={initialData?.description ?? ""} placeholder="Sensory notes..." className="kiyota-input w-full h-32 text-sm" />
          <div className="grid grid-cols-3 gap-6">
             <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-stone-400">Net Weight (G)</label>
                <input name="weightGrams" type="number" value={currentWeight} onChange={(e) => setCurrentWeight(Number(e.target.value))} className="kiyota-input w-full font-bold" />
             </div>
             <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-[#D4AF37]">Price (LKR)</label>
                <input name="priceLkr" type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} className="kiyota-input w-full font-bold border-[#D4AF37]" />
             </div>
             <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-stone-400">USD Logic</label>
                <select name="pricingLogic" defaultValue={initialData?.pricingLogic ?? "AUTO_CONVERT"} className="kiyota-input w-full text-[10px]">
                  <option value="AUTO_CONVERT">Auto-Convert</option>
                  <option value="MANUAL">Manual Override</option>
                </select>
             </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <div className="bg-[#2C1810] p-8 rounded-sm text-white space-y-6 shadow-2xl sticky top-32">
           <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <TruckIcon className="w-4 h-4 text-[#D4AF37]" /><p className="text-[10px] font-black uppercase text-[#D4AF37]">Landed Cost Preview</p>
           </div>
           {landedCosts.map(c => (
             <div key={c.region} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-[8px] uppercase text-stone-500">{c.region}</span>
                <span className="text-xs font-black">LKR {c.total.toLocaleString()}</span>
             </div>
           ))}
        </div>

        <div className="bg-white border p-6 rounded-sm space-y-4">
           <p className="text-[10px] font-black uppercase text-stone-400">Gallery</p>
           <div className="grid grid-cols-2 gap-2">
              {images.map(img => (
                <div key={img} className="aspect-square relative group">
                  <Image src={img} alt="" fill className="object-cover rounded-sm" />
                  <button type="button" onClick={() => setImages(images.filter(i => i !== img))} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-3 h-3 text-white" /></button>
                </div>
              ))}
              <button type="button" onClick={handleUpload} className="aspect-square border border-dashed flex items-center justify-center hover:border-[#D4AF37] transition-all"><PlusIcon className="w-4 h-4 text-stone-300" /></button>
           </div>
           <input type="hidden" name="imageUrls" value={JSON.stringify(images)} />
        </div>

        <div className="bg-[#FAF9F6] border p-8 space-y-4">
           <button disabled={isPending} className="w-full bg-[#D4AF37] text-[#2C1810] py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#2C1810] hover:text-white transition-all shadow-xl">
             {isPending ? "Syncing..." : "Update Master Asset"}
           </button>
           <div className="flex items-center gap-2">
              <GlobeIcon className="w-3 h-3 text-stone-400" />
              <select name="displayMode" defaultValue={initialData?.displayMode ?? "BOTH"} className="bg-transparent text-[8px] font-black uppercase text-stone-400 outline-none">
                 <option value="BOTH">Global Visibility</option>
                 <option value="LKR_ONLY">Local Only</option>
                 <option value="USD_ONLY">International Only</option>
              </select>
           </div>
           {state?.error && <p className="text-red-500 text-[8px] font-bold uppercase text-center">{state.error}</p>}
        </div>
      </div>
    </form>
  );
}