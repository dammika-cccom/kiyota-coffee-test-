import { db } from "@/db";
import { systemSettings, shippingRates, bankAccounts, countries } from "@/db/schema";
import { updateGlobalSettings, updateShippingRate } from "./actions";
import { 
  GlobeIcon, 
  TruckIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon,
  AwardIcon,
  PlusIcon
} from "@/components/ui/icons";
import BankManager from "./BankManager";
import CountryManager from "./CountryManager";

export default async function InstitutionalSettingsPage() {
  // Parallel Data Aggregation for Institutional Speed
  const [settingsResult, rates, accounts, countryList] = await Promise.all([
    db.select().from(systemSettings).limit(1),
    db.select().from(shippingRates),
    db.select().from(bankAccounts),
    db.select().from(countries)
  ]);
  
  const settings = settingsResult[0];

   return (
    <div className="max-w-5xl space-y-12 animate-in fade-in duration-1000 pb-20">
      {/* EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-100 pb-10">
        <div className="space-y-2">
           <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">Global Control Tower</h5>
           <h2 className="text-4xl font-serif italic text-[#2C1810]">System Configuration</h2>
        </div>
        <div className="flex items-center gap-3 bg-stone-900 text-[#FAF9F6] px-5 py-2.5 rounded-sm shadow-xl">
           <ShieldCheckIcon className="w-4 h-4 text-green-500" />
           <span className="text-[9px] font-black uppercase tracking-widest">Master Governance Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* WING 1: FINANCIAL ENGINE (CURRENCY) */}
        <section className="bg-white p-10 border border-stone-100 shadow-sm rounded-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-stone-50 pb-4">
             <TrendingUpIcon className="w-5 h-5 text-[#D4AF37]" />
             <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Exchange Rate (LKR/USD)</h3>
          </div>
          
          <form action={updateGlobalSettings} className="space-y-6">
             <div className="space-y-2">
                <p className="text-[10px] text-stone-400 uppercase font-black">Institutional Master Rate: 1 USD</p>
                <div className="flex items-center gap-4">
                   <span className="text-2xl font-serif text-stone-300 italic">LKR</span>
                   <input 
                     name="exchangeRate" 
                     type="number" 
                     step="0.01" 
                     defaultValue={settings?.exchangeRate || "325.00"}
                     className="kiyota-input w-full text-4xl font-serif border-none p-0 focus:ring-0 text-[#2C1810]" 
                   />
                </div>
             </div>
             <button className="w-full bg-[#2C1810] text-[#FAF9F6] py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-[#2C1810] transition-all shadow-xl">
               Update Master Rate
             </button>
          </form>
        </section>

        {/* WING 2: LOGISTICS ENGINE (SHIPPING) */}
        <section className="bg-[#FAF9F6] border border-stone-200 p-10 rounded-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
             <TruckIcon className="w-5 h-5 text-[#2C1810]" />
             <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Logistics Tiers</h3>
          </div>

          <div className="space-y-12">
            {rates.map((rate) => (
              <form 
                key={rate.id} 
                action={updateShippingRate.bind(null, rate.id)} 
                className="space-y-5"
              >
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-3 h-3 text-[#D4AF37]" />
                  <p className="text-[10px] font-black text-[#2C1810] uppercase tracking-[0.2em]">
                    Region: {rate.region?.replace("_", " ")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Base Rate (1st KG)</label>
                     <input name="firstKg" defaultValue={rate.firstKgRate || ""} className="kiyota-input bg-white w-full text-sm font-bold" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Additional KG</label>
                     <input name="additionalKg" defaultValue={rate.additionalKgRate || ""} className="kiyota-input bg-white w-full text-sm font-bold" />
                  </div>
                </div>

                <button className="text-[9px] font-black uppercase text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1 hover:text-[#2C1810] transition-all">
                  Sync {rate.region} Logic
                </button>
              </form>
            ))}
          </div>
        </section>

        {/* WING 3: INSTITUTIONAL BANKING (New B2B Component) */}
        <section className="bg-white p-10 border border-stone-100 shadow-sm rounded-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-stone-50 pb-4">
             <AwardIcon className="w-5 h-5 text-[#D4AF37]" />
             <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Revenue Accounts</h3>
          </div>
          <BankManager initialAccounts={accounts} />
        </section>

        {/* WING 4: COUNTRY REGISTRY (New B2B Component) */}
        <section className="bg-[#FAF9F6] border border-stone-200 p-10 rounded-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
             <PlusIcon className="w-5 h-5 text-[#2C1810]" />
             <h3 className="text-xs font-black uppercase tracking-widest text-[#2C1810]">Export Destinations</h3>
          </div>
          <CountryManager initialCountries={countryList} />
        </section>

      </div>
    </div>
  );
}