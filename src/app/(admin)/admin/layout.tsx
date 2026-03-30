import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";
import { 
  LayoutIcon, PackageIcon, ClipboardListIcon, UsersIcon, 
  BookOpenIcon, GlobeIcon, TrendingUpIcon, MoveLeftIcon, CoffeeIcon, ShieldCheckIcon
} from "@/components/ui/icons";



export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const role = session?.role || "";

  // Institutional Guard: Kick out unauthorized users
  if (!role.includes("_ADMIN") && role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const menuSections = [
    {
      group: "Commercial (B2C)",
      roles: ["SUPER_ADMIN", "RETAIL_ADMIN"],
      items: [
        { name: "Market Overview", href: "/admin", icon: LayoutIcon },
        { name: "Product Catalog", href: "/admin/products", icon: PackageIcon },
        { name: "Retail Orders", href: "/admin/orders", icon: ClipboardListIcon },
      ]
    },
    {
      group: "Corporate (B2B)",
      roles: ["SUPER_ADMIN", "WHOLESALE_ADMIN"],
      items: [
        { name: "Export & Pricing", href: "/admin/wholesale", icon: GlobeIcon },
      ]
    },
    {
      group: "Roastery Ops",
      roles: ["SUPER_ADMIN", "COFFEESHOP_ADMIN", "FARM_ADMIN"],
      items: [
        { name: "Nursery Ledger", href: "/admin/farmers", icon: TrendingUpIcon },
        { name: "Highland Journal", href: "/admin/stories", icon: BookOpenIcon },
      ]
    },
    {
      group: "System Control",
      roles: ["SUPER_ADMIN"],
      items: [
        { name: "Member Directory", href: "/admin/users", icon: UsersIcon },
        { name: "Global Settings", href: "/admin/settings", icon: ShieldCheckIcon },
      ]
    }  
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* PROFESSIONAL ADMIN SIDEBAR */}
      <aside className="w-64 bg-[#2C1810] text-white fixed h-full shadow-2xl z-50 flex flex-col">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
             {/* FIXED: Utilized 'CoffeeIcon' for Institutional Branding */}
             <CoffeeIcon className="w-6 h-6 text-[#D4AF37]" />
             <h2 className="text-xl font-serif italic text-white uppercase tracking-tighter">Kiyota Admin</h2>
          </div>
          <p className="text-[10px] uppercase font-black tracking-widest text-[#D4AF37] mt-2 opacity-80">
            {role.replace('_', ' ')} Session
          </p>
        </div>
        
        <nav className="p-4 space-y-8 mt-6 flex-grow overflow-y-auto no-scrollbar">
          {menuSections
            .filter(section => section.roles.includes(role))
            .map((section) => (
            <div key={section.group} className="space-y-2">
                <p className="px-4 text-[8px] font-black uppercase text-stone-500 tracking-widest">{section.group}</p>
                <div className="space-y-1">
                    {section.items.map((item) => (
                        <Link key={item.name} href={item.href} className="flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-[#D4AF37] transition-all rounded-sm group">
                            <item.icon className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
          ))}
        </nav>

        {/* LOGOUT & EXIT FOOTER */}
        <div className="p-6 border-t border-white/5 bg-[#25140d] space-y-3">
           <SignOutButton />
           
           <Link href="/" className="flex items-center gap-3 text-[10px] uppercase font-bold text-stone-500 hover:text-white transition-colors group">
              {/* FIXED: Utilized 'MoveLeftIcon' for Exit link */}
              <MoveLeftIcon className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
              Exit Dashboard
           </Link>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-12 min-h-screen">
        {children}
      </main>
    </div>
  );
}