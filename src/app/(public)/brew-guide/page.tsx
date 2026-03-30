import { ThermometerIcon, DropletsIcon, ClockIcon, CoffeeIcon, SparklesIcon } from "@/components/ui/icons";

export default function BrewGuidePage() {
  const guides = [
    { method: "Japanese V60", ratio: "1:15", temp: "92°C", time: "3:00", icon: DropletsIcon },
    { method: "French Press", ratio: "1:12", temp: "95°C", time: "4:00", icon: ClockIcon },
    { method: "Syphon", ratio: "1:14", temp: "90°C", time: "2:30", icon: ThermometerIcon },
  ];

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <SparklesIcon className="w-12 h-12 text-[#D4AF37] mx-auto opacity-40" />
        <h1 className="text-5xl md:text-8xl font-serif italic text-[#2C1810] tracking-tighter leading-tight">
          Precision Brewing
        </h1>
        <p className="text-stone-500 text-lg font-light leading-relaxed">
          The bean is only 50% of the flavor. The rest is pure science. <br /> 
          Follow our Japanese-standard guides for the perfect Kiyota experience.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-40">
        {guides.map((g) => (
          <div key={g.method} className="p-12 rounded-sm border border-stone-100 shadow-sm space-y-8 group hover:shadow-2xl transition-all duration-700 bg-white">
            <div className="flex justify-between items-start">
              <g.icon className="w-10 h-10 text-[#D4AF37]" />
              <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center">
                 <CoffeeIcon className="w-4 h-4 text-[#2C1810] opacity-20" />
              </div>
            </div>
            <h2 className="text-4xl font-serif italic text-[#2C1810]">{g.method}</h2>
            
            <div className="space-y-4 pt-10 border-t border-stone-50">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase text-stone-400">Brew Ratio</span>
                <span className="text-sm font-mono font-bold text-[#2C1810]">{g.ratio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase text-stone-400">Ideal Temp</span>
                <span className="text-sm font-mono font-bold text-[#2C1810]">{g.temp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase text-stone-400">Extraction Time</span>
                <span className="text-sm font-mono font-bold text-[#2C1810]">{g.time}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-[#2C1810] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all cursor-pointer">
              Launch Masterclass
            </button>
          </div>
        ))}
      </div>

      <section className="bg-[#2C1810] py-32 px-6 text-center text-white">
         <div className="max-w-2xl mx-auto space-y-8">
            <h3 className="text-2xl font-serif italic">Need Professional Training?</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Our Academy provides hands-on sessions with these exact tools. <br />
              Enroll today to master the art of extraction.
            </p>
         </div>
      </section>
    </div>
  );
}