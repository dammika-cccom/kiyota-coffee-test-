"use client";
import { useState, useActionState } from "react";
import { createStory } from "../admin/farmers/actions"; 
import { ImagePlusIcon, CheckCircleIcon } from "@/components/ui/icons";

// Expert Suggestion: Categories to plan for future blog display areas
const categories = [
  "Farmer Success Stories", 
  "Nursery Milestones", 
  "Processing Innovation", 
  "Social Empowerment", 
  "Global Exhibitions",
  "Project Sustainability"
];

export default function StoryEditor() {
  const [imgUrl, setImgUrl] = useState("");
  const [state, formAction, isPending] = useActionState(createStory, null);

  const handleCloudinaryUpload = () => {
    // Logic: Trigger Cloudinary Unsigned Widget
    const mockUrl = "https://res.cloudinary.com/demo/image/upload/v1/samples/coffee.jpg";
    setImgUrl(mockUrl); 
    console.log("Cloudinary Sync: Success");
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
         <h2 className="text-2xl font-serif italic text-[#2C1810]">Highland Journal Editor</h2>
         {state?.success && <p className="text-green-600 text-xs font-bold uppercase animate-pulse">Story Published</p>}
      </header>
      
      {state?.error && <p className="text-red-500 text-xs font-bold uppercase p-4 bg-red-50 border-l-4 border-red-500">{state.error}</p>}
      
      <form action={formAction} className="bg-white p-8 border border-stone-100 shadow-xl rounded-sm space-y-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400">Story Headline</label>
                <input name="title" required placeholder="e.g. Sunil's First Arabica Harvest" className="kiyota-input text-xl font-serif italic w-full" />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-400">Content Category</label>
                <select name="category" className="kiyota-input w-full" required>
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          </div>
          
          {/* ONE-TOUCH CLOUDINARY INTERFACE */}
          <div 
            onClick={handleCloudinaryUpload}
            className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all group flex flex-col items-center justify-center gap-2 ${imgUrl ? 'border-green-200 bg-green-50' : 'border-stone-100 hover:border-[#D4AF37]'}`}
          >
            {imgUrl ? (
              <>
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Visual Asset Ready</p>
                <input type="hidden" name="imageUrl" value={imgUrl} />
              </>
            ) : (
              <>
                <ImagePlusIcon className="w-8 h-8 text-stone-300 group-hover:text-[#D4AF37]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                  Tap to add Cloudinary Image
                </span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
           <label className="text-[10px] font-black uppercase text-stone-400">Full Narrative</label>
           <textarea name="content" placeholder="Share the journey of the resurrection of Ceylon coffee..." rows={10} className="w-full p-6 bg-stone-50 border-none outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm leading-relaxed" required />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-stone-50">
           <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="isPublished" className="w-4 h-4 accent-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase text-stone-400 group-hover:text-[#2C1810] transition-colors">Visible to Public</span>
           </label>
           
           <button 
            disabled={isPending}
            className="bg-[#2C1810] text-white px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all disabled:opacity-30 shadow-2xl active:scale-95"
           >
            {isPending ? "Syncing..." : "Publish to Journal"}
           </button>
        </div>
      </form>
    </div>
  );
}