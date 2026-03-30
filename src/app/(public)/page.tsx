import { db } from "@/db";
import { products, farms, stories } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPinIcon, 
  TrendingUpIcon, 
  AwardIcon, 
  CoffeeIcon, 
  GlobeIcon, 
  BookOpenIcon, 
  SparklesIcon, 
  ShoppingBagIcon, 
  MoveRightIcon 
} from "@/components/ui/icons";
import TraceabilityPortal from "@/components/ui/TraceabilityPortal";

/**
 * INSTITUTIONAL HOMEPAGE ARCHITECTURE
 * Engineered for Zero-ESLint, Zero-Any, and High-Velocity B2C Conversion.
 */
export default async function HomePage() {
  // 1. DATA AGGREGATION: Parallel Execution for Roastery Speed
  const [featuredProducts, farmNetwork, latestStories] = await Promise.all([
    // Fetch 4 B2C Retail Products
    db.select()
      .from(products)
      .where(and(eq(products.isRetailEnabled, true), eq(products.status, "ACTIVE")))
      .limit(4),
    
    // Fetch 3 Farm Regions (Utilized in Origin Ecosystem section)
    db.select().from(farms).limit(3),
    
    // Fetch 2 Latest Published Stories (Utilized in Journal section)
    db.select()
      .from(stories)
      .where(eq(stories.isPublished, true))
      .orderBy(desc(stories.createdAt))
      .limit(2)
  ]);

  return (
    <div className="bg-white antialiased">
      
      {/* --- 1. CINEMATIC HERO: AUTHORITY & MISSION --- */}
      <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2C1810]/60 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070" 
          alt="Kiyota Heritage" 
          fill 
          priority 
          className="object-cover scale-105"
        />
        <div className="relative z-20 text-center space-y-10 px-6 max-w-5xl animate-in fade-in duration-1000">
          <div className="flex justify-center items-center gap-4 text-[#D4AF37]">
             <div className="h-[1px] w-12 bg-current opacity-30" />
             <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-white">Japanese Standards • Sri Lankan Soil</h5>
             <div className="h-[1px] w-12 bg-current opacity-30" />
          </div>
          <h1 className="text-white text-6xl md:text-[110px] font-serif italic tracking-tighter leading-[0.9] drop-shadow-2xl">
            Resurrecting <br /> <span className="text-[#D4AF37]">Ceylon</span> Coffee.
          </h1>
          <p className="text-[#FAF9F6] text-sm md:text-lg font-light max-w-2xl mx-auto opacity-90 leading-loose">
            From the Japan Fair Trade Committee to the Central Highlands. We are restoring the 19th-century Arabica legacy through scientific roasting and ethical facilitation.
          </p>
          
          <div className="max-w-md mx-auto">
             <TraceabilityPortal />
          </div>

          <div className="pt-10 flex flex-wrap justify-center gap-6">
            <Link href="/shop" className="bg-[#D4AF37] text-[#2C1810] px-14 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-2xl shadow-[#D4AF37]/20">
              Shop The Roastery
            </Link>
            <Link href="/wholesale" className="border-2 border-white/20 text-white px-14 py-5 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-[#2C1810] transition-all backdrop-blur-md">
              Wholesale & Export
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. IMPACT RIBBON: GLOBAL TRUST SIGNALS --- */}
      <div className="bg-[#2C1810] py-16 border-y border-[#D4AF37]/20 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
           {[
             { label: "Farmers Facilitated", val: "4,500+", icon: CoffeeIcon },
             { label: "Active Nurseries", val: "400,000+", icon: TrendingUpIcon },
             { label: "Highest Altitude", val: "1,850m", icon: MapPinIcon },
             { label: "Quality Protocol", val: "JFTC Certified", icon: AwardIcon }
           ].map((stat, i) => (
             <div key={i} className="text-center space-y-3 group cursor-default">
                <stat.icon className="w-6 h-6 text-[#D4AF37] mx-auto opacity-40 group-hover:opacity-100 transition-all duration-500" />
                <span className="text-[#FAF9F6] font-mono text-3xl font-bold block tracking-tighter">{stat.val}</span>
                <span className="text-[#D4AF37]/50 text-[9px] uppercase tracking-[0.4em] font-black">{stat.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* --- 3. FEATURED COLLECTION: B2C RETAIL --- */}
      <section className="bg-[#FAF9F6] py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-stone-200 pb-8">
            <div className="space-y-2">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Retail Selection</h5>
              <h2 className="text-4xl md:text-6xl font-serif italic text-[#2C1810]">Curated For You.</h2>
            </div>
            <Link href="/shop" className="text-[11px] font-black uppercase tracking-widest text-[#2C1810] border-b-2 border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-all">View Store</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const images = product.imageUrls as string[] | null;
              const firstImage = images?.[0] || "https://images.unsplash.com/photo-1559056191-75902420fef5";

              return (
                <div key={product.id} className="group bg-white p-6 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    <div className="aspect-square bg-[#FAF9F6] relative overflow-hidden rounded-sm">
                      <Link href={`/shop/${product.slug}`}>
                         <Image 
                           src={firstImage} 
                           alt={product.name} 
                           fill 
                           className="object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-1000"
                         />
                      </Link>
                      <div className="absolute top-3 left-3 bg-[#2C1810] text-[#D4AF37] text-[8px] font-black px-2 py-1 uppercase tracking-widest shadow-lg">SCA {product.scaScore || '85+'}</div>
                    </div>
                    <div className="space-y-1 text-center">
                      <h3 className="text-lg font-serif italic text-[#2C1810] line-clamp-1">{product.name}</h3>
                      <p className="text-lg font-bold text-[#D4AF37]">LKR {Number(product.priceLkr || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <Link href={`/shop/${product.slug}`} className="w-full mt-8 py-4 bg-[#2C1810] text-white text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 shadow-lg group">
                    <ShoppingBagIcon className="w-4 h-4" /> 
                    <span className="group-hover:translate-x-1 transition-transform font-bold">Experience Roast</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 4. THE SOURCE: ORIGIN ECOSYSTEM (Utilizing farmNetwork) --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
        <div className="relative h-[700px] rounded-sm overflow-hidden shadow-2xl group">
           <Image 
             src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1200" 
             alt="Highland Nursery" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms]"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/80 to-transparent" />
           <div className="absolute bottom-10 left-10 text-white">
              <h4 className="text-3xl font-serif italic text-[#D4AF37]">The Nursery Project</h4>
              <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">Vertical Logistics: Matale</p>
           </div>
        </div>
        
        <div className="space-y-12">
          <div className="space-y-6">
            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Traceability</h5>
            <h2 className="text-5xl md:text-7xl font-serif italic text-[#2C1810] leading-none tracking-tighter">Origin <br/> Ecosystem.</h2>
            <p className="text-stone-500 font-light leading-loose text-justify text-lg italic">
              Our strength lies in the 4,500 families we facilitate. By providing nursery seedlings and Japanese sorting technology, we ensure the highest density beans from Matale to Nuwara Eliya.
            </p>
          </div>

          <div className="space-y-8">
            {farmNetwork.map((farm) => (
              <div key={farm.id} className="flex justify-between items-end border-b border-stone-100 pb-4 group">
                 <div>
                    <h4 className="text-xl font-serif italic text-[#2C1810] group-hover:text-[#D4AF37] transition-colors">{farm.region}</h4>
                    <div className="flex items-center gap-2 text-stone-400 mt-1">
                       <MapPinIcon className="w-3 h-3" />
                       <span className="text-[10px] font-bold uppercase">{farm.elevation || '1200m'} Elevation</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold text-[#2C1810]">{farm.farmerCount || 0}</p>
                    <p className="text-[9px] uppercase font-black text-[#D4AF37]">Families</p>
                 </div>
              </div>
            ))}
          </div>
          <Link href="/farmers" className="inline-block bg-[#2C1810] text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all shadow-xl">
             Meet the Producers
          </Link>
        </div>
      </section>

      {/* --- 5. INDUSTRIAL CAPACITY: B2B SECTION --- */}
      <section className="bg-[#2C1810] py-32 px-6 text-white overflow-hidden relative">
        <GlobeIcon className="absolute -right-10 -bottom-10 w-64 h-64 text-[#D4AF37] opacity-5 rotate-12" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-20 items-center">
           <div className="lg:col-span-1 space-y-6">
              <GlobeIcon className="w-12 h-12 text-[#D4AF37] opacity-40" />
              <h2 className="text-4xl font-serif italic leading-tight">Industrial <br/> Scale.</h2>
              <p className="text-stone-400 text-sm leading-loose">Equipped with high-airflow Japanese roasting technology for global container-load exports.</p>
           </div>
           <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
              <div className="p-10 border border-white/5 bg-white/5 rounded-sm space-y-6">
                 <SparklesIcon className="w-8 h-8 text-[#D4AF37]" />
                 <h4 className="text-xl font-serif italic">White Labeling</h4>
                 <p className="text-xs text-stone-500 leading-relaxed italic">Tailored roasting profiles for international boutique brands.</p>
              </div>
              <div className="p-10 border border-white/5 bg-white/5 rounded-sm space-y-6">
                 <BookOpenIcon className="w-8 h-8 text-[#D4AF37]" />
                 <h4 className="text-xl font-serif italic">Academy Mastery</h4>
                 <p className="text-xs text-stone-500 leading-relaxed italic">Technical masterclasses in extraction and sensory science.</p>
              </div>
           </div>
        </div>
      </section>

      {/* --- 6. THE HIGHLAND JOURNAL (Utilizing latestStories) --- */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-16">
        <div className="flex justify-between items-end border-b border-stone-100 pb-8">
            <h2 className="text-4xl md:text-6xl font-serif italic text-[#2C1810]">Recent Dispatches.</h2>
            <Link href="/stories" className="text-[11px] font-black uppercase text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {latestStories.map((story) => (
            <Link href={`/stories/${story.slug}`} key={story.id} className="group grid md:grid-cols-2 gap-8 items-center bg-[#FAF9F6] p-8 rounded-sm hover:shadow-xl transition-all duration-500">
               <div className="relative aspect-square shrink-0 overflow-hidden rounded-sm bg-white">
                  <Image src={story.imageUrl || ""} alt={story.title} fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest">{story.category}</span>
                  <h3 className="text-2xl font-serif italic text-[#2C1810] leading-tight line-clamp-2">{story.title}</h3>
                  <p className="text-xs text-stone-400 leading-relaxed italic line-clamp-2">{story.content}</p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase text-[#2C1810]">Read Story <MoveRightIcon className="w-3 h-3" /></div>
               </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}