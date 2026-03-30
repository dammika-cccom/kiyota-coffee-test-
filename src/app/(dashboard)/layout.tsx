import Link from "next/link";
import { getSession } from "@/lib/session";
import SignOutButton from "@/app/(admin)/admin/SignOutButton";
import { 
  GlobeIcon, 
  BookOpenIcon, 
  MoveLeftIcon, 
  ShoppingBagIcon,
  MapPinIcon, // FIXED: Now rendered in Navigation
  AwardIcon,
  ShieldCheckIcon,
  TrendingUpIcon
} from "@/components/ui/icons";

export const runtime = 'edge';

interface KiyotaSession {
  userId: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  loyaltyPoints?: number;
}

export default async function MemberVaultLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession() as KiyotaSession | null;
  const role = session?.role || "GUEST";

  // Navigation now utilizes MapPinIcon to ensure zero ESLint errors
  const navigation = [
    { name: "My Coffee Orders", href: "/profile/orders", icon: ShoppingBagIcon, show: true },
    { name: "Trace My Batch", href: "/trace", icon: MapPinIcon, show: true }, // FIXED: Icon used
    { name: "B2B Export Desk", href: "/profile/export", icon: GlobeIcon, show: role === "WHOLESALE_USER" || role === "SUPER_ADMIN" },
    { name: "Academy Schedule", href: "/profile/academy", icon: BookOpenIcon, show: role === "STUDENT" || role === "SUPER_ADMIN" },
    { name: "Vault Settings", href: "/profile/settings", icon: ShieldCheckIcon, show: true },
  ];

  const initialA = session?.firstName?.charAt(0) || session?.email?.charAt(0) || "K";
  const initialB = session?.lastName?.charAt(0) || "";

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      <aside className="w-72 bg-white border-r border-stone-200 fixed h-full z-40 flex flex-col shadow-sm">
        <div className="p-10 border-b border-stone-50">
          <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
            <AwardIcon className="w-4 h-4" />
            <p className="text-[9px] uppercase font-black tracking-[0.3em]">Kiyota Vault</p>
          </div>
          <h2 className="text-2xl font-serif italic text-[#2C1810]">Member HQ</h2>
        </div>
        
        <nav className="p-6 space-y-1 flex-grow overflow-y-auto">
          {navigation.filter(m => m.show).map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-[#2C1810] hover:bg-stone-50 transition-all rounded-sm group">
              <item.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-8 space-y-4">
           <div className="bg-[#2C1810] p-5 rounded-sm border border-white/5 shadow-xl relative overflow-hidden">
              <TrendingUpIcon className="absolute -right-2 -bottom-2 w-12 h-12 text-[#D4AF37] opacity-10" />
              <p className="text-[8px] font-black uppercase text-[#D4AF37] tracking-widest">Loyalty Points</p>
              <p className="text-2xl font-bold text-white mt-1">{session?.loyaltyPoints || 0} <span className="text-[9px] text-stone-500 uppercase font-black">Pts</span></p>
           </div>
           <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-[#2C1810] flex items-center justify-center text-[10px] text-white font-bold uppercase">{initialA}{initialB}</div>
              <span className="text-[10px] font-black text-[#2C1810] uppercase truncate">{session?.firstName || 'Member'}</span>
           </div>
           <SignOutButton />
           <Link href="/" className="flex items-center gap-3 px-2 py-2 text-[9px] uppercase font-black text-stone-400 hover:text-[#2C1810] transition-colors group">
              <MoveLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
              Return to Roastery
           </Link>
        </div>
      </aside>
      <main className="flex-1 ml-72 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto p-12 lg:p-20">{children}</div>
      </main>
    </div>
  );
}