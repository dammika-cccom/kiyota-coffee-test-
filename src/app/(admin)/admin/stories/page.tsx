import { db } from "@/db";
import { stories } from "@/db/schema";
import StoryForm from "./StoryForm"; // FIXED: Use the new Client Component

export default async function AdminStoriesPage() {
  const allStories = await db.select().from(stories);

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <header>
        <h5 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37]">Storytelling Engine</h5>
        <h2 className="text-4xl font-serif italic text-[#2C1810]">Highland Journal</h2>
      </header>

      <StoryForm />

      <section className="space-y-6">
         <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Journal Archive</h3>
         <div className="divide-y divide-stone-100 border-t border-stone-100">
            {allStories.map(s => (
              <div key={s.id} className="py-6 flex justify-between items-center">
                 <div>
                    <p className="font-bold text-[#2C1810]">{s.title}</p>
                    <p className="text-[10px] uppercase text-stone-400 tracking-tighter">{s.category} • {s.isPublished ? "Published" : "Draft"}</p>
                 </div>
                 <button className="text-[10px] font-black uppercase text-[#D4AF37] hover:text-[#2C1810]">Edit</button>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}