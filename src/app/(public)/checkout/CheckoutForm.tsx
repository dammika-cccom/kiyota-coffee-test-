"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { processInstitutionalPayment, type PaymentMethod, type OrderPayload } from "./pay-actions";
import { 
  RefreshCwIcon, ShieldCheckIcon, GlobeIcon, 
  TruckIcon, AwardIcon, PackageIcon 
} from "@/components/ui/icons";
import type { ShippingRate, BankAccount } from "./page";

interface CheckoutFormProps {
  initialRates: ShippingRate[];
  bankAccounts: BankAccount[];
  userRole: string;
  creditBalance: string;
}

export default function CheckoutForm({ initialRates, bankAccounts, userRole, creditBalance }: CheckoutFormProps) {
  const { cart, totalWeightGrams, clearCart } = useCart();
  const { currency, exchangeRate } = useCurrency();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [country, setCountry] = useState("Sri Lanka");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAYHERE");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });

  const isB2B = userRole === "WHOLESALE_USER";

  const calculateItemLkr = (item: CartItem): number => {
    let price = item.priceLkr;
    if (item.id.includes("WHITE_LABEL")) price *= 1.05;
    if (item.id.includes("BULK_JUTE")) price *= 0.98;
    return price * item.quantity;
  };

  const modifiedSubtotalLkr = useMemo(() => cart.reduce((acc, item) => acc + calculateItemLkr(item), 0), [cart]);
  const currentRate = initialRates.find(r => country === "Sri Lanka" ? r.region === "SRI_LANKA" : r.region === "INTERNATIONAL");
  
  const shipCost = useMemo(() => {
    const base = Number(currentRate?.firstKgRate || 500);
    const extra = Number(currentRate?.additionalKgRate || 150);
    const grossWeightKg = Math.ceil((totalWeightGrams * 1.1) / 1000);
    return base + (Math.max(0, grossWeightKg - 1) * extra);
  }, [currentRate, totalWeightGrams]);

  const grandTotalLkr = modifiedSubtotalLkr + shipCost;
  const referenceTotalUsd = (grandTotalLkr / exchangeRate).toFixed(2);

  const onFinalizeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);

    const payload: OrderPayload = {
      ...formData,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      country,
      amount: grandTotalLkr,
      paymentType: paymentMethod,
      shippingCost: shipCost,
      items: cart.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: calculateItemLkr(i) / i.quantity, weight: i.weightGrams }))
    };

    const result = await processInstitutionalPayment(payload);

    if (result.success) {
      if (result.method === "PAYHERE" && formRef.current) {
        clearCart();
        formRef.current.submit();
      } else {
        clearCart();
        router.push(`/checkout/success?method=${result.method}&id=${result.orderId}`);
      }
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} method="POST" onSubmit={onFinalizeOrder} className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      <div className="space-y-12">
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase text-[#2C1810] border-l-2 border-[#D4AF37] pl-4">Delivery Identity</h3>
          <div className="grid grid-cols-2 gap-4">
             <input name="firstName" placeholder="First Name" className="kiyota-input" required onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
             <input name="lastName" placeholder="Last Name" className="kiyota-input" required onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input name="email" placeholder="Business Email" type="email" className="kiyota-input w-full" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input name="phone" placeholder="WhatsApp" className="kiyota-input w-full" required onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="kiyota-input w-full bg-white">
            <option value="Sri Lanka">Sri Lanka (Domestic)</option>
            <option value="Japan">Japan (Export)</option>
            <option value="Other">Other</option>
          </select>
          <textarea name="address" placeholder="Full Street Address" className="kiyota-input w-full h-24" required onChange={(e) => setFormData({...formData, address: e.target.value})} />
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase text-[#2C1810] border-l-2 border-[#D4AF37] pl-4">Payment Strategy</h3>
          <div className="grid grid-cols-1 gap-3">
             {[
               { id: "PAYHERE", label: "Online Pay", show: !isB2B, icon: GlobeIcon, sub: "Cards & Wallets" },
               { id: "BANK_TRANSFER", label: "Bank Transfer", show: true, icon: AwardIcon, sub: "Direct Deposit" },
               // FIXED: TruckIcon utilized for COD
               { id: "COD", label: "Cash on Delivery", show: !isB2B && country === "Sri Lanka", icon: TruckIcon, sub: "Local Only" },
               // FIXED: creditBalance utilized in sub-label
               { id: "ON_CREDIT", label: "Institutional Credit", show: isB2B, icon: ShieldCheckIcon, sub: `Limit: LKR ${Number(creditBalance).toLocaleString()}` }
             ].filter(opt => opt.show).map((opt) => (
               <label key={opt.id} className={`flex items-center justify-between p-6 border rounded-sm cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-[#2C1810] bg-[#FAF9F6] shadow-md' : 'border-stone-100'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="pay" checked={paymentMethod === opt.id} onChange={() => setPaymentMethod(opt.id as PaymentMethod)} className="accent-[#2C1810]" />
                    <div>
                        <p className="text-sm font-bold text-[#2C1810]">{opt.label}</p>
                        <p className="text-[10px] text-stone-400 font-medium uppercase">{opt.sub}</p>
                    </div>
                  </div>
                  <opt.icon className={`w-5 h-5 ${paymentMethod === opt.id ? 'text-[#D4AF37]' : 'text-stone-200'}`} />
               </label>
             ))}
          </div>
          {paymentMethod === "BANK_TRANSFER" && (
            <div className="p-6 bg-stone-900 text-[#FAF9F6] rounded-sm space-y-4 animate-in slide-in-from-top-2">
               <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Transfer Coordinates</p>
               {bankAccounts.filter(acc => acc.type === (isB2B ? "CORPORATE" : "RETAIL")).map(acc => (
                 <div key={acc.id} className="space-y-1 font-mono text-xs border-b border-white/5 pb-4 last:border-0">
                    <p>Bank: {acc.bankName}</p><p>Acc No: {acc.accountNumber}</p><p>Branch: {acc.branch}</p>
                 </div>
               ))}
            </div>
          )}
        </section>
      </div>

      <div className="bg-[#FAF9F6] p-10 border border-stone-100 rounded-sm space-y-8 h-fit sticky top-32 shadow-sm">
        <h3 className="text-xs font-black uppercase text-[#2C1810] flex items-center gap-2"><PackageIcon className="w-4 h-4" /> Order Audit</h3>
        <div className="space-y-3 border-b border-stone-200 pb-6 max-h-60 overflow-y-auto no-scrollbar">
           {cart.map(item => (
             <div key={item.id} className="flex justify-between text-xs">
                <span className="text-stone-400 font-bold uppercase">{item.name}</span>
                <span className="font-bold text-[#2C1810]">LKR {calculateItemLkr(item).toLocaleString()}</span>
             </div>
           ))}
        </div>
        <div className="text-right border-t pt-4">
            <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest mb-1">Grand Total ({currency})</p>
            <p className="text-3xl font-serif italic text-[#2C1810]">LKR {grandTotalLkr.toLocaleString()}</p>
            <p className="text-stone-300 tracking-tighter uppercase text-[9px]">Ref: ${referenceTotalUsd} USD</p>
        </div>
        <button type="submit" disabled={isSubmitting || cart.length === 0} className="w-full bg-[#2C1810] text-white py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3">
          {isSubmitting ? <RefreshCwIcon className="w-4 h-4 animate-spin" /> : "Commit Procurement"}
        </button>
      </div>
    </form>
  );
}