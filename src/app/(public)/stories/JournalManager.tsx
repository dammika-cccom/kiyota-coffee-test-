"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClockIcon, MoveRightIcon, FilterIcon, CoffeeIcon } from "@/components/ui/icons";

// FIXED: Strict Interface to maintain 'Zero-Any' standard
interface JournalStory {
  id: string;
  title: string;
  content: string;
  category: string | null;
  imageUrl: string | null;
  slug: string;
  createdAt: Date | null;
}

interface JournalManagerProps {
  featuredStory: JournalStory | null;
  initialStories: JournalStory[];
}

export default function JournalManager({ featuredStory, initialStories }: JournalManagerProps) {
  const [filter, setFilter] = useState("ALL");

  const categories = [
    { id: "ALL", label: "All Narratives" },
    { id: "Farmer Success Stories", label: "Farmer Success" },
    { id: "Nursery Milestones", label: "Supply Chain" },
    { id: "Technical Innovation", label: "Roasting & Tech" },
    { id: "Global Exhibitions", label: "Exhibitions" }
  ];

  const filteredStories = filter === "ALL" 
    ? initialStories 
    : initialStories.filter(s => s.category === filter);

  return (
    <div className="space-y-24">
      
      {/* 1. FEATURED NARRATIVE */}
      {featuredStory && filter === "ALL" && (
        <section className="group animate-in fade-in duration-1000">
          <Link href={`/stories/${featuredStory.slug}`} className="grid lg:grid-cols-2 gap-0 bg-white border border-stone-100 shadow-2xl overflow-hidden rounded-sm">
            <div className="relative h-[400px] lg:h-full overflow-hidden">
               <Image 
                 src={featuredStory.imageUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"} 
                 alt={featuredStory.title} fill className="object-cover transition-transform duration-[3000ms] group-hover:scale-105"
               />
               <div className="absolute top-8 left-8">
                  <span className="bg-[#D4AF37] text-white text-[8px] font-black px-4 py-1.5 uppercase tracking-widest shadow-xl">Latest Narrative</span>
               </div>
            </div>
            <div className="p-12 md:p-20 flex flex-col justify-center space-y-8">
               <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">{featuredStory.category}</span>
               <h2 className="text-4xl md:text-6xl font-serif italic text-[#2C1810] leading-tight group-hover:text-[#D4AF37] transition-colors">{featuredStory.title}</h2>
               <p className="text-stone-500 font-light leading-relaxed text-lg line-clamp-3 italic">
                 &quot;{featuredStory.content.substring(0, 200)}...&quot;
               </p>
               <div className="flex items-center gap-4 text-[#2C1810] font-black text-[10px] uppercase tracking-widest pt-4">
                  Explore Narrative <MoveRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </div>
            </div>
          </Link>
        </section>
      )}

      {/* 2. SENSORY FILTER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-stone-200 pb-8">
        <div className="flex gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap transition-all border-b-2 pb-2 cursor-pointer ${
                filter === cat.id ? "border-[#D4AF37] text-[#2C1810]" : "border-transparent text-stone-300 hover:text-stone-500"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-stone-400">
           <FilterIcon className="w-3 h-3" /> {filteredStories.length + (filter === 'ALL' && featuredStory ? 1 : 0)} Journal Entries
        </div>
      </div>

      {/* 3. STORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {filteredStories.map((story) => (
          <article key={story.id} className="flex flex-col space-y-6 animate-in fade-in duration-1000 group">
            <Link href={`/stories/${story.slug}`} className="relative aspect-[16/10] overflow-hidden rounded-sm shadow-sm group-hover:shadow-2xl transition-all duration-700">
              <Image
                src={story.imageUrl || "https://images.unsplash.com/photo-1559056191-75902420fef5"}
                alt={story.title}
                fill
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute top-4 left-4">
                 <span className="bg-white/90 backdrop-blur-md text-[#2C1810] text-[7px] font-black px-3 py-1 uppercase tracking-widest shadow-sm">
                    {story.category}
                 </span>
              </div>
            </Link>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-stone-400">
                 <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Editorial</span>
                 </div>
                 <span className="text-[8px] font-black uppercase tracking-tighter">
                    {/* FIXED: Date fallback provided to prevent ts(2769) */}
                    {new Date(story.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
              </div>

              <Link href={`/stories/${story.slug}`} className="block">
                <h3 className="text-2xl font-serif italic text-[#2C1810] group-hover:text-[#D4AF37] transition-colors leading-tight">
                  {story.title}
                </h3>
              </Link>

              <p className="text-sm text-stone-500 font-light leading-relaxed line-clamp-3">
                {story.content}
              </p>

              <Link href={`/stories/${story.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2C1810] border-b border-[#2C1810]/10 pb-1 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                Read Narrative <MoveRightIcon className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* 4. EMPTY STATE */}
      {filteredStories.length === 0 && (filter !== "ALL" || !featuredStory) && (
        <div className="py-40 text-center space-y-6 animate-in fade-in">
           <CoffeeIcon className="w-12 h-12 text-stone-100 mx-auto" />
           <p className="text-xs uppercase font-black tracking-widest text-stone-300 italic">No narratives found in this classification.</p>
           <button onClick={() => setFilter("ALL")} className="text-[#D4AF37] text-[10px] font-black uppercase border-b border-[#D4AF37] pb-1 cursor-pointer hover:text-[#2C1810] transition-colors">Reset Journal</button>
        </div>
      )}
    </div>
  );
}