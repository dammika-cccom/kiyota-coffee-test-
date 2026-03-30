"use client";

import { useActionState, useState } from "react";
import { createProduct, ProductFormState } from "./actions";
import { PlusIcon, GlobeIcon, AwardIcon } from "@/components/ui/icons"; // FIXED: Removed unused PackageIcon
import Image from "next/image"; // FIXED: Using Next.js Image component

export default function ProductForm() {
  const [state, formAction, isPending] = useActionState(createProduct, {} as ProductFormState);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setImages((prev) => [...prev, data.secure_url]);
    } catch (error) {
      // FIXED: Using error variable or suppressing it properly
      console.error("Upload error:", error);
      alert("Image upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        
        <section className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-4">Core Identity</h3>
          <div className="space-y-4">
            <input name="name" required placeholder="Product Name (e.g. Kyoto Gold)" className="w-full border-b border-stone-200 py-3 text-lg font-serif italic outline-none focus:border-[#D4AF37] bg-transparent" />
            <textarea name="description" placeholder="Brand storytelling / Flavor description..." className="w-full border border-stone-100 p-4 h-32 text-sm outline-none focus:border-[#D4AF37] bg-stone-50" />
            
            <div className="grid grid-cols-2 gap-4">
              <select name="category" required className="border-b border-stone-200 py-2 text-sm bg-transparent outline-none">
                <option value="SPECIALTY_ARABICA">Specialty Arabica</option>
                <option value="GREEN_BEANS">Green Beans (B2B)</option>
                <option value="CEYLON_SPICES">Ceylon Spices</option>
                <option value="EQUIPMENT">Brewing Equipment</option>
              </select>
              <input name="weightGrams" type="number" required placeholder="Weight (Grams)" className="border-b border-stone-200 py-2 text-sm bg-transparent outline-none" />
            </div>
          </div>
        </section>

        <section className="bg-white p-8 border border-stone-100 shadow-sm rounded-sm space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <AwardIcon className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2C1810]">Technical Specs</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <input name="scaScore" placeholder="SCA Score (e.g. 88+)" className="border-b border-stone-200 py-2 text-sm outline-none bg-transparent" />
            <input name="altitude" placeholder="Altitude (e.g. 1500m)" className="border-b border-stone-200 py-2 text-sm outline-none bg-transparent" />
            <input name="originRegion" placeholder="Region (e.g. Matale)" className="border-b border-stone-200 py-2 text-sm outline-none bg-transparent" />
            <input name="processingMethod" placeholder="Process (e.g. Honey)" className="border-b border-stone-200 py-2 text-sm outline-none bg-transparent" />
          </div>
        </section>

        <section className="bg-stone-900 p-8 rounded-sm shadow-xl space-y-8 text-white">
           <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <GlobeIcon className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Global Pricing Engine</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-4">
                 <p className="text-[8px] font-black uppercase opacity-40">Retail Pricing</p>
                 <input name="price" type="number" step="0.01" placeholder="LKR Price" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-[#D4AF37]" />
                 <input name="priceUsd" type="number" step="0.01" placeholder="USD Price" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-[#D4AF37]" />
              </div>
              <div className="space-y-4">
                 <p className="text-[8px] font-black uppercase text-[#D4AF37]">Wholesale Tiers</p>
                 <input name="wholesalePriceLkr" type="number" step="0.01" placeholder="LKR Wholesale" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-[#D4AF37]" />
                 <input name="wholesalePriceUsd" type="number" step="0.01" placeholder="USD Wholesale" className="w-full bg-transparent border-b border-white/20 py-2 text-sm outline-none focus:border-[#D4AF37]" />
              </div>
           </div>

           <div className="flex gap-8 pt-4 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                 <input name="isInquiryOnly" type="checkbox" className="w-4 h-4 accent-[#D4AF37]" />
                 <span className="text-[9px] font-black uppercase group-hover:text-[#D4AF37] transition-colors">Price on Request (B2B)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                 <input name="isWholesaleOnly" type="checkbox" className="w-4 h-4 accent-[#D4AF37]" />
                 <span className="text-[9px] font-black uppercase group-hover:text-[#D4AF37] transition-colors">Wholesale Only</span>
              </label>
           </div>
        </section>
      </div>

      <div className="space-y-8">
         <section className="bg-white p-8 border border-stone-100 rounded-sm shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Product Imagery</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
               {images.map((url, i) => (
                 <div key={i} className="aspect-square relative rounded-sm overflow-hidden border border-stone-100">
                    {/* FIXED: Using Next.js Image component for previews */}
                    <Image 
                      src={url} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                 </div>
               ))}
               <label className="aspect-square border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#D4AF37] transition-colors rounded-sm">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#D4AF37] border-t-transparent" />
                  ) : (
                    <><PlusIcon className="w-5 h-5 text-stone-300" /><span className="text-[8px] uppercase font-black text-stone-400">Upload</span></>
                  )}
                  <input type="file" className="hidden" onChange={handleImageUpload} />
               </label>
            </div>
            <input type="hidden" name="imageUrls" value={JSON.stringify(images)} />
            <p className="text-[9px] text-stone-400 leading-relaxed italic">Max 4 images. Optimized for web delivery.</p>
         </section>

         <button 
           type="submit" 
           disabled={isPending || uploading}
           className="w-full bg-[#2C1810] text-white py-6 text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#D4AF37] transition-all duration-500 disabled:bg-stone-300 cursor-pointer"
         >
           {isPending ? "Connecting to Roastery..." : "Publish to Global Shop"}
         </button>
         
         {state?.error && <p className="text-red-600 text-[10px] font-bold text-center uppercase tracking-widest">{state.error}</p>}
      </div>
    </form>
  );
}