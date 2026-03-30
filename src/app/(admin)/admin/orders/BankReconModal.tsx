"use client";

import { useState } from "react";
import { reconcileSampathCSV } from "./reconcile-actions";
import { XIcon, FileTextIcon, UploadIcon, CheckCircleIcon, RefreshCwIcon } from "@/components/ui/icons";

interface ReconModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BankReconModal({ isOpen, onClose }: ReconModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target?.result as string;
      const response = await reconcileSampathCSV(csvData);
      setResult(response);
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#2C1810]/60 backdrop-blur-md" onClick={onClose} />

      {/* MODAL BODY */}
      <div className="relative bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <header className="bg-[#2C1810] p-6 text-white flex justify-between items-center">
           <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Automation Layer</p>
              <h3 className="text-xl font-serif italic">Sampath Bank Reconciliation</h3>
           </div>
           <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
              <XIcon className="w-5 h-5" />
           </button>
        </header>

        <div className="p-10 space-y-8">
           {!result ? (
             <div className="space-y-6">
                <div className="border-2 border-dashed border-stone-100 rounded-sm p-12 text-center space-y-4 hover:border-[#D4AF37] transition-all relative group">
                   <UploadIcon className="w-10 h-10 mx-auto text-stone-200 group-hover:text-[#D4AF37] transition-colors" />
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-[#2C1810]">Drop Sampath CSV Statement here</p>
                      <p className="text-[10px] text-stone-400 uppercase">Maximum file size: 2MB</p>
                   </div>
                   <input 
                      type="file" 
                      accept=".csv" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading}
                   />
                </div>
                
                {isUploading && (
                  <div className="flex items-center justify-center gap-3 text-[#D4AF37] animate-pulse">
                     <RefreshCwIcon className="w-4 h-4 animate-spin" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Parsing Ledger Data...</span>
                  </div>
                )}
             </div>
           ) : (
             <div className="text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-2">
                {result.success ? (
                  <>
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                       <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-serif italic text-[#2C1810]">Reconciliation Complete</h4>
                       <p className="text-xs text-stone-500 mt-2 uppercase font-bold tracking-widest">
                          {result.count} Orders marked as PAID
                       </p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-red-50 text-red-700 rounded-sm text-[10px] font-bold uppercase">
                     {result.error}
                  </div>
                )}
                <button 
                  onClick={() => { setResult(null); onClose(); }}
                  className="w-full bg-[#2C1810] text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all"
                >
                   Close Processor
                </button>
             </div>
           )}

           <div className="bg-[#FAF9F6] p-4 rounded-sm border border-stone-100 flex gap-4 items-start">
              <FileTextIcon className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-[9px] text-stone-400 leading-relaxed italic">
                Ensure your CSV contains the <span className="text-[#2C1810] font-bold">&quot;Reference&quot;</span> column as provided by Sampath Vishwa. The system will match this against the Order Reconciliation ID.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}