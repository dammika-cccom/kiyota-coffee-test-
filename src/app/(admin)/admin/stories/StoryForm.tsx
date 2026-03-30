"use client";

import { useActionState, useState, useEffect } from "react";
import { createStory, ActionResponse } from "@/app/(admin)/admin/farmers/actions";
import { ImagePlusIcon, CheckCircleIcon, BookOpenIcon, TrashIcon } from "@/components/ui/icons";
import Image from "next/image";

const categories = [
  { value: "Farmer Success Stories", label: "Farmer Success" },
  { value: "Nursery Milestones", label: "Nursery Updates" },
  { value: "Technical Innovation", label: "Roasting & Tech" },
  { value: "Global Exhibitions", label: "Exhibitions" },
  { value: "Institutional Achievements", label: "Awards & SCA" },
  { value: "Sustainability", label: "Eco Updates" }
];

export default function StoryForm() {
  const [imgUrl, setImgUrl] = useState("");
  const [state, formAction, isPending] = useActionState(createStory, null as ActionResponse);

  // Clear image state on successful publication
  useEffect(() => {
    if (state?.success) {
      setImgUrl("");
    }
  }, [state]);

  const handleCloudinaryUpload = () => {
    // ICT TechLead Note: Trigger for Cloudinary Unsigned Widget
    // Real URL return simulation for D: Drive Local Server
    const simulatedUrl = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800";
    setImgUrl(simulatedUrl);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {state?.success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
          <p className="text-green-700 text-xs font-black uppercase tracking-widest">{state.success}</p>
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
        </div>
      )}

      <form action={formAction} className="bg-white p-10 border border-stone-100 shadow-2xl rounded-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-stone-50 pb-6">
          <BookOpenIcon className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-serif italic text-[#2C1810]">Create Journal Entry</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Inputs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Story Headline</label>
              <input 
                name="title" 
                required 
                placeholder="e.g. The 2026 Nuwara Eliya Harvest" 
                className="kiyota-input w-full text-2xl font-serif italic focus:border-[#D4AF37] transition-all" 
              />
              <p className="text-[8px] text-stone-300 italic uppercase">Recommended: 50-60 characters for SEO</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Classification</label>
              <select 
                name="category" 
                className="kiyota-input w-full bg-transparent cursor-pointer font-bold text-[#2C1810]" 
                required
              >
                <option value="">Select Category...</option>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* ONE-TOUCH ASSET HUB */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Cover Image</label>
            <div 
              onClick={handleCloudinaryUpload}
              className={`relative aspect-video rounded-sm border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${
                imgUrl ? 'border-green-500 bg-stone-50' : 'border-stone-200 hover:border-[#D4AF37]'
              }`}
            >
              {imgUrl ? (
                <>
                  <Image src={imgUrl} alt="Preview" fill className="object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] font-black uppercase">Change Image</p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <ImagePlusIcon className="w-8 h-8 text-stone-200 group-hover:text-[#D4AF37] transition-colors mx-auto" />
                  <span className="block text-[9px] font-black uppercase text-stone-400 tracking-tighter">Sync Cloudinary</span>
                </div>
              )}
            </div>
            <input type="hidden" name="imageUrl" value={imgUrl} />
            {imgUrl && (
              <button 
                type="button" 
                onClick={() => setImgUrl("")} 
                className="text-[8px] font-black uppercase text-red-400 hover:text-red-600 flex items-center gap-1"
              >
                <TrashIcon className="w-3 h-3" /> Remove Asset
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-stone-400 tracking-widest">The Narrative</label>
          <textarea 
            name="content" 
            required 
            rows={8} 
            className="w-full bg-stone-50 p-6 text-sm outline-none focus:ring-1 focus:ring-[#D4AF37] resize-none leading-relaxed text-[#2C1810]" 
            placeholder="Describe the facilitation, event, or success story in detail..." 
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-stone-50">
           <div className="flex gap-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="isPublished" className="w-4 h-4 accent-[#D4AF37]" defaultChecked />
                <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-[#2C1810] transition-colors">Visible to Public</span>
              </label>
           </div>
           
           <button 
            disabled={isPending}
            className="w-full md:w-auto bg-[#2C1810] text-white px-16 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] transition-all disabled:opacity-30 shadow-2xl active:scale-95"
           >
            {isPending ? "Connecting to Roastery..." : "Publish to Journal"}
           </button>
        </div>
      </form>
    </div>
  );
}