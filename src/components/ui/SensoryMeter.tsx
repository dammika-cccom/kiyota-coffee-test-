"use client";

export default function SensoryMeter({ label, value, max = 5 }: { label: string, value: number, max?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{label}</span>
        <span className="text-[10px] font-mono text-[#D4AF37]">{value}/{max}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < value ? 'bg-[#D4AF37]' : 'bg-stone-100'}`} 
          />
        ))}
      </div>
    </div>
  );
}