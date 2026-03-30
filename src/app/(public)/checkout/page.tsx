import { db } from "@/db";
import { shippingRates, bankAccounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import CheckoutForm from "./CheckoutForm";

export type ShippingRate = typeof shippingRates.$inferSelect;
export type BankAccount = typeof bankAccounts.$inferSelect;

export default async function CheckoutPage() {
  const session = await getSession();
  
  // 1. INSTITUTIONAL DATA AGGREGATION
  // We fetch everything needed for both B2C and B2B workflows in parallel
  const [rates, accounts, userProfile] = await Promise.all([
    db.select().from(shippingRates),
    db.select().from(bankAccounts).where(eq(bankAccounts.isActive, true)),
    session ? db.select().from(users).where(eq(users.id, session.userId)).limit(1) : [null]
  ]);

  const user = userProfile[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen animate-in fade-in duration-1000">
      <header className="mb-16 border-b border-stone-100 pb-12">
        <div className="flex flex-col gap-2">
           <h5 className="text-[10px] uppercase tracking-[0.6em] font-black text-[#D4AF37]">
             {user?.role === 'WHOLESALE_USER' ? 'Wholesale Procurement' : 'Final Step'}
           </h5>
           <h1 className="text-5xl font-serif italic text-[#2C1810]">
             Secure Checkout
           </h1>
        </div>
      </header>

      {/* 2. Pass strictly typed data and user context to the client form */}
      <CheckoutForm 
        initialRates={rates} 
        bankAccounts={accounts} 
        userRole={user?.role || "GUEST"}
        creditBalance={user?.creditBalance || "0.00"}
      />
    </div>
  );
}