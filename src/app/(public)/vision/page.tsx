import { AwardIcon, UsersIcon, GlobeIcon } from "@/components/ui/icons";
import Link from "next/link";
import Image from "next/image";

export default function VisionPage() {
  return (
    <div className="bg-[#FAF9F6]">
      {/* VISION HERO */}
      <section className="pt-40 pb-20 px-6 text-center">
        <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37] mb-6">Management Vision</h5>
        <h1 className="text-5xl md:text-[100px] font-serif italic text-[#2C1810] tracking-tighter leading-none">
          The Founders&apos; Circle
        </h1>
        <div className="h-[500px] max-w-7xl mx-auto mt-20 relative shadow-2xl rounded-sm overflow-hidden">
           {/* FIXED: Added 'sizes' */}
           <Image 
             src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2071" 
             alt="Visionary Leadership" 
             fill
             sizes="100vw"
             className="object-cover"
           />
           <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      {/* CORE STORY */}
      <section className="max-w-4xl mx-auto px-6 py-32 space-y-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-serif italic text-[#2C1810]">Bridging Nations Through a Bean.</h2>
          <p className="text-stone-500 text-lg leading-relaxed text-justify">
            Founded on the principle that Sri Lanka possesses the world&apos;s most vibrant unrefined coffee profiles and Japan possesses the world&apos;s most refined roasting techniques, Kiyota was born.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 pt-20 border-t border-stone-200">
          <div className="text-center space-y-4">
            <GlobeIcon className="w-10 h-10 mx-auto text-[#D4AF37]" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Global Standards</h4>
            <p className="text-xs text-stone-400 font-light leading-loose">Highland roasts for the global market.</p>
          </div>
          <div className="text-center space-y-4">
            <AwardIcon className="w-10 h-10 mx-auto text-[#D4AF37]" />
            <h4 className="text-xs font-bold uppercase tracking-widest">Fair Trade+</h4>
            <p className="text-xs text-stone-400 font-light leading-loose">30% Above market value to farmers.</p>
          </div>
          <div className="text-center space-y-4">
            <UsersIcon className="w-10 h-10 mx-auto text-[#D4AF37]" />
            <h4 className="text-xs font-bold uppercase tracking-widest">CSR Impact</h4>
            <p className="text-xs text-stone-400 font-light leading-loose">Supporting 200+ local families.</p>
          </div>
        </div>
      </section>

      {/* LEADERSHIP PORTRAITS */}
      <section className="bg-white py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-24">
             <h2 className="text-4xl font-serif italic text-[#2C1810]">Leadership</h2>
             <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest">Precision • Transparency</p>
          </div>

          <div className="grid md:grid-cols-2 gap-32">
            <div className="group space-y-8">
              <div className="aspect-[4/5] bg-stone-100 relative grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden shadow-xl rounded-sm">
                 {/* FIXED: Added 'sizes' */}
                 <Image src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" alt="Founder 1" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-black text-[#D4AF37] tracking-[0.3em]">CEO & Master Roaster</h4>
                <h3 className="text-3xl font-serif italic">Kenji Kiyota</h3>
              </div>
            </div>
            <div className="group space-y-8 lg:mt-32">
              <div className="aspect-[4/5] bg-stone-100 relative grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden shadow-xl rounded-sm">
                 {/* FIXED: Added 'sizes' */}
                 <Image src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" alt="Founder 2" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-black text-[#D4AF37] tracking-[0.3em]">Director of Agriculture</h4>
                <h3 className="text-3xl font-serif italic">Anjali Perera</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#2C1810] py-32 text-center text-white px-6">
         <div className="max-w-2xl mx-auto space-y-10">
            <h2 className="text-4xl font-serif italic">Wholesale Partnerships</h2>
            <Link href="/wholesale" className="inline-block border border-[#D4AF37] text-[#D4AF37] px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#D4AF37] hover:text-white transition-all">
               Request Portfolio
            </Link>
         </div>
      </section>
    </div>
  );
}