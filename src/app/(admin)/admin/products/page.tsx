import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq, lt } from "drizzle-orm";
import Link from "next/link";
import { 
  PlusIcon, 
  PackageIcon, 
  AlertTriangleIcon, 
  FilterIcon,
  TrendingUpIcon 
} from "@/components/ui/icons";
import ProductList from "./ProductList";

/**
 * NEXT.JS 15 TYPE DEFINITIONS
 * searchParams is a Promise in Next.js 15
 */
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export type ProductWithFullMeta = typeof products.$inferSelect;

export default async function AdminProductListPage({ 
  searchParams 
}: { 
  searchParams: SearchParams 
}) {
  // 1. Resolve searchParams for filtering
  const query = await searchParams;
  const filter = query.filter as string;

  // 2. INSTITUTIONAL FILTER LOGIC
  // Dynamically build the 'where' clause based on dashboard triggers
  let whereClause;
  if (filter === "low-stock") {
    whereClause = lt(products.stockQuantity, 15);
  } else if (filter === "retail") {
    whereClause = eq(products.isRetailEnabled, true);
  } else if (filter === "wholesale") {
    whereClause = eq(products.isWholesaleOnly, true);
  }

  const allProducts: ProductWithFullMeta[] = await db
    .select()
    .from(products)
    .where(whereClause)
    .orderBy(desc(products.createdAt));

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      
      {/* --- HEADER: BRANDED COMMAND --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-stone-100 pb-8 gap-6">
        <div className="space-y-2">
          <h5 className="text-[10px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">
            Inventory Engine
          </h5>
          <h2 className="text-4xl font-serif italic text-[#2C1810]">
            Commercial Archive
          </h2>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* LOGISTICS FILTER NAV */}
          <div className="flex bg-stone-100 p-1 rounded-sm border border-stone-200">
             <Link 
               href="/admin/products" 
               className={`px-4 py-2 text-[9px] font-black uppercase rounded-sm transition-all flex items-center gap-2 ${!filter ? 'bg-white shadow-sm text-[#2C1810]' : 'text-stone-400 hover:text-stone-600'}`}
             >
               <FilterIcon className="w-3 h-3" /> All
             </Link>
             <Link 
               href="/admin/products?filter=low-stock" 
               className={`px-4 py-2 text-[9px] font-black uppercase rounded-sm transition-all flex items-center gap-2 ${filter === 'low-stock' ? 'bg-red-600 text-white shadow-md' : 'text-stone-400 hover:text-red-500'}`}
             >
               <AlertTriangleIcon className="w-3 h-3" /> Risks
             </Link>
             <Link 
               href="/admin/products?filter=retail" 
               className={`px-4 py-2 text-[9px] font-black uppercase rounded-sm transition-all flex items-center gap-2 ${filter === 'retail' ? 'bg-[#D4AF37] text-[#2C1810] shadow-md' : 'text-stone-400 hover:text-[#D4AF37]'}`}
             >
               <TrendingUpIcon className="w-3 h-3" /> B2C
             </Link>
          </div>

          <Link 
            href="/admin/products/new" 
            className="bg-[#2C1810] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-[#D4AF37] transition-all shadow-xl"
          >
             <PlusIcon className="w-4 h-4" /> Create New Roast
          </Link>
        </div>
      </header>

      {/* --- NOTIFICATION LAYER: DYNAMIC ALERTS --- */}
      {filter === 'low-stock' && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-sm flex items-center gap-4 animate-in slide-in-from-top-2 duration-500">
           <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <AlertTriangleIcon className="w-5 h-5 text-white" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Supply Chain Warning</p>
              <p className="text-xs text-red-800 font-medium">Displaying {allProducts.length} assets currently below the 15-unit institutional safety buffer.</p>
           </div>
        </div>
      )}

      {/* --- DATA VIEW --- */}
      {allProducts.length > 0 ? (
        <ProductList products={allProducts} />
      ) : (
        <div className="py-40 text-center bg-white border border-dashed border-stone-200 rounded-sm">
           <PackageIcon className="w-12 h-12 mx-auto text-stone-200 mb-4" />
           <p className="text-xs uppercase font-black tracking-widest text-stone-400">
             No matching records found in the Matale Archive
           </p>
           <Link 
             href="/admin/products" 
             className="text-[#D4AF37] text-[10px] font-black uppercase underline mt-6 inline-block hover:text-[#2C1810] transition-colors"
           >
             Clear All Filters
           </Link>
        </div>
      )}
    </div>
  );
}