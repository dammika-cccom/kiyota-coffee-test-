"use client";

import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { linkLotAndProgress, updateOrderStatus } from "./actions";
import { seedTestingOrders } from "./reconcile-actions";
import { generateShippingLabel } from "@/lib/logistics-label";
import BankReconModal from "./BankReconModal";
import { 
  PackageIcon, 
  MapPinIcon, 
  MoveRightIcon, 
  AwardIcon,
  TruckIcon,
  CheckCircleIcon,
  PlusIcon,
  RefreshCwIcon,
  FileTextIcon,
  XIcon, // FIXED: Only using imported version
  CoffeeIcon 
} from "@/components/ui/icons";
import type { OrderRecord, LotRecord } from "./page";

// Define Metadata Item Interface to kill 'any'
interface OrderLineItem {
  id: string;
  name: string;
  weight: number;
  quantity: number;
}

type PipelineState = "IDLE" | "SUCCESS";

export default function FulfillmentPipeline({ 
  initialOrders, 
  availableLots 
}: { 
  initialOrders: OrderRecord[], 
  availableLots: LotRecord[] 
}) {
  const [activeTab, setActiveTab] = useState("PAID");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [viewState, setViewState] = useState<PipelineState>("IDLE");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReconOpen, setIsReconOpen] = useState(false);
  
  const { convert } = useCurrency();

  const tabs = ["PENDING", "PAID", "ROASTING", "SHIPPED", "DELIVERED"];
  const filteredOrders = initialOrders.filter(o => o.status === activeTab);

  const handleBulkSeed = async () => {
    setIsProcessing(true);
    await seedTestingOrders();
    setIsProcessing(false);
  };

  const handleLotAssignment = async (orderId: string, lotNum: string) => {
    if (!lotNum) return;
    setIsProcessing(true);
    const res = await linkLotAndProgress(orderId, lotNum);
    if (res.success) setViewState("SUCCESS");
    setIsProcessing(false);
  };

  const handleDispatch = async (orderId: string) => {
    setIsProcessing(true);
    const res = await updateOrderStatus(orderId, "SHIPPED");
    if (res.success) setViewState("SUCCESS");
    setIsProcessing(false);
  };

  const resetWorkArea = () => {
    setSelectedOrder(null);
    setViewState("IDLE");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 border border-stone-100 rounded-sm shadow-sm">
           <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); resetWorkArea(); }}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm whitespace-nowrap ${
                  activeTab === tab ? 'bg-[#2C1810] text-white shadow-lg' : 'bg-stone-50 text-stone-300 hover:text-[#2C1810]'
                }`}
              >
                {tab} ({initialOrders.filter(o => o.status === tab).length})
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <button onClick={() => setIsReconOpen(true)} className="px-4 py-2 bg-stone-100 text-stone-600 rounded-sm text-[9px] font-black uppercase flex items-center gap-2 hover:bg-stone-200 transition-all">
               <FileTextIcon className="w-3 h-3" /> Recon
            </button>
            <button onClick={handleBulkSeed} className="px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-sm text-[9px] font-black uppercase flex items-center gap-2 hover:bg-[#D4AF37] hover:text-white transition-all">
               {isProcessing ? <RefreshCwIcon className="w-3 h-3 animate-spin" /> : <PlusIcon className="w-3 h-3" />} Seed
            </button>
          </div>
        </div>

        <div className="bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <tbody className="divide-y divide-stone-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className={`hover:bg-stone-50/50 transition-all cursor-pointer group ${selectedOrder?.id === order.id ? 'bg-[#FAF9F6]' : ''}`} onClick={() => { setSelectedOrder(order); setViewState("IDLE"); }}>
                  <td className="p-6 font-mono text-xs font-bold text-[#D4AF37]">#{order.id.slice(0,8).toUpperCase()}</td>
                  <td className="p-6 font-bold text-[#2C1810]">{order.customerName}</td>
                  <td className="p-6 text-right font-black text-[#2C1810]">{convert(order.amount || "0")}</td>
                  <td className="p-6 text-right"><MoveRightIcon className="w-4 h-4 text-stone-200 group-hover:text-[#D4AF37] transition-all ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        {viewState === "SUCCESS" ? (
          <div className="bg-green-600 p-10 rounded-sm text-white text-center space-y-6 animate-in zoom-in duration-300">
             <CheckCircleIcon className="w-16 h-16 mx-auto" />
             <h3 className="text-2xl font-serif italic text-white">Institutional Sync Complete</h3>
             <button onClick={resetWorkArea} className="w-full bg-[#2C1810] py-4 text-[10px] font-black uppercase tracking-widest text-white">Next Order</button>
          </div>
        ) : selectedOrder ? (
          <div className="bg-[#2C1810] p-8 rounded-sm text-white space-y-8 shadow-2xl sticky top-32">
             <div className="border-b border-white/5 pb-4 flex justify-between items-center">
                <h3 className="text-xl font-serif italic">{selectedOrder.customerName}</h3>
                <button onClick={resetWorkArea}><XIcon className="w-5 h-5 text-stone-500 hover:text-white" /></button>
             </div>
             
             {/* LINE ITEMS BREAKDOWN */}
             <section className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                   <CoffeeIcon className="w-4 h-4 text-[#D4AF37]" />
                   <p className="text-[9px] font-black uppercase text-stone-400">Order Contents</p>
                </div>
                <div className="space-y-2">
                   {/* FIXED: Replaced 'any' with typed interface */}
                   {(selectedOrder.metadata?.items as OrderLineItem[])?.map((item) => (
                     <div key={item.id} className="flex justify-between text-[10px] bg-white/5 p-2 rounded-sm">
                        <span>{item.name} ({item.weight}G)</span>
                        <span className="text-[#D4AF37] font-bold">x{item.quantity}</span>
                     </div>
                   ))}
                </div>
             </section>

             <section className="space-y-4">
                <div className="flex gap-3 items-start">
                   <MapPinIcon className="w-4 h-4 text-stone-500 mt-1" />
                   <p className="text-xs leading-relaxed text-stone-300">{selectedOrder.customerAddress}</p>
                </div>
             </section>

             {selectedOrder.status === "PAID" && (
                <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-4">
                   <p className="text-[10px] font-black uppercase flex items-center gap-2 text-stone-200">
                      <AwardIcon className="w-4 h-4 text-[#D4AF37]" /> Link Lot #
                   </p>
                   <select 
                     disabled={isProcessing}
                     onChange={(e) => handleLotAssignment(selectedOrder.id, e.target.value)}
                     className="w-full bg-[#1A1A1A] border-none text-[10px] p-3 text-white focus:ring-1 focus:ring-[#D4AF37]"
                   >
                      <option value="">Assign Physical Batch</option>
                      {availableLots.map(l => <option key={l.id} value={l.lotNumber}>{l.lotNumber}</option>)}
                   </select>
                </div>
             )}

             <div className="pt-6 border-t border-white/5 space-y-3">
                <button onClick={() => generateShippingLabel(selectedOrder)} className="w-full bg-white/5 border border-white/10 py-4 text-[9px] font-black uppercase flex items-center justify-center gap-3 hover:bg-white hover:text-[#2C1810] transition-all">
                   <TruckIcon className="w-4 h-4 text-[#D4AF37]" /> Print Logistics Label
                </button>
                {selectedOrder.status === "ROASTING" && (
                  <button onClick={() => handleDispatch(selectedOrder.id)} className="w-full bg-[#D4AF37] text-[#2C1810] py-4 text-[10px] font-black uppercase tracking-widest shadow-xl">Confirm Dispatch</button>
                )}
             </div>
          </div>
        ) : (
          <div className="h-64 border border-dashed border-stone-200 rounded-sm flex flex-col items-center justify-center p-8 bg-[#FAF9F6] text-stone-400">
             <PackageIcon className="w-10 h-10 mb-2 opacity-20" />
             <p className="text-[10px] uppercase font-black tracking-widest">Select item to fulfill</p>
          </div>
        )}
      </div>

      <BankReconModal isOpen={isReconOpen} onClose={() => setIsReconOpen(false)} />
    </div>
  );
}