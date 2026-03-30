import { db } from "@/db";
import { stories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import JournalManager from "./JournalManager";

// Institutional SEO Meta
export const metadata = {
  title: "Highland Journal | Sourcing & Sustainability at Kiyota Coffee",
  description: "Narratives from our 4,500 farmer network, nursery milestones, and the science of Ceylon Arabica.",
};

export default async function StoriesPage() {
  // 1. Fetch all published narratives from D-Drive
  const allStories = await db
    .select()
    .from(stories)
    .where(eq(stories.isPublished, true))
    .orderBy(desc(stories.createdAt));

  // 2. Separate the latest story to act as the "Featured Narrative"
  const featuredStory = allStories[0];
  const remainingStories = allStories.slice(1);

  return (
    <div className="bg-[#FAF9F6] min-h-screen pb-40">
      {/* INSTITUTIONAL HEADER */}
      <section className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h5 className="text-[10px] uppercase tracking-[0.8em] font-black text-[#D4AF37] animate-in slide-in-from-bottom duration-700">
          The Highland Journal
        </h5>
        <h1 className="text-6xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter leading-none">
          Chronicles of <br /> Origin.
        </h1>
        <div className="h-[1px] w-24 bg-[#D4AF37] mx-auto my-8 opacity-40" />
      </section>

      <main className="max-w-7xl mx-auto px-6">
        <JournalManager 
          featuredStory={featuredStory} 
          initialStories={remainingStories} 
        />
      </main>
    </div>
  );
}