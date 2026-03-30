import ProductForm from "./ProductForm";
import Link from "next/link";
import { MoveLeftIcon } from "@/components/ui/icons";

export default function NewProductPage() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4">
        <Link href="/admin/products" className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2 hover:text-[#2C1810] transition-colors">
          <MoveLeftIcon className="w-3 h-3" /> Back to Archive
        </Link>
        <h2 className="text-4xl font-serif italic text-[#2C1810]">New Roast Profile</h2>
      </header>

      <ProductForm />
    </div>
  );
}