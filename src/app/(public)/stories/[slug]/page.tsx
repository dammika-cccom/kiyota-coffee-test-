import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MoveLeftIcon, CoffeeIcon } from "@/components/ui/icons";

export default async function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [story] = await db
    .select()
    .from(stories)
    .where(eq(stories.slug, slug))
    .limit(1);

  if (!story) notFound();

  return (
    <article className="bg-white min-h-screen pb-40">
      {/* NAVIGATION */}
      <nav className="max-w-4xl mx-auto px-6 pt-32 pb-12">
        <Link href="/stories" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#2C1810] transition-colors">
          <MoveLeftIcon className="w-3 h-3" /> Back to Journal
        </Link>
      </nav>

      {/* STORY HEADER */}
      <header className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.4em]">{story.category}</span>
          <h1 className="text-5xl md:text-7xl font-serif italic text-[#2C1810] leading-none tracking-tighter">
            {story.title}
          </h1>
          <p className="text-stone-400 text-sm italic font-light tracking-wide">
            Narrated by {story.author} • {new Date(story.createdAt || new Date()).toLocaleDateString()}
          </p>
        </div>

        <div className="relative aspect-video w-full rounded-sm overflow-hidden shadow-2xl">
          <Image 
            src={story.imageUrl || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"} 
            alt={story.title} 
            fill 
            className="object-cover" 
          />
        </div>
      </header>

      {/* STORY CONTENT */}
      <section className="max-w-3xl mx-auto px-6 pt-20">
        <div className="prose prose-stone prose-lg max-w-none">
          <p className="text-stone-600 leading-[2.2] text-justify whitespace-pre-wrap font-light first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-[#D4AF37]">
            {story.content}
          </p>
        </div>

        {/* INSTITUTIONAL SIGNATURE */}
        <div className="mt-32 pt-12 border-t border-stone-100 flex flex-col items-center text-center space-y-6">
           <CoffeeIcon className="w-10 h-10 text-[#D4AF37] opacity-20" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-300">
              A Kiyota Coffee Roasters Production
           </p>
        </div>
      </section>
    </article>
  );
}