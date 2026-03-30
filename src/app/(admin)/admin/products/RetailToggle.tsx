"use client";
import { useState } from "react";
// We will build this action in the next step
import { toggleRetailStatus } from "./actions"; 

export default function RetailToggle({ id, initialState }: { id: string, initialState: boolean }) {
  const [enabled, setEnabled] = useState(initialState);

  return (
    <button
      onClick={async () => {
        const next = !enabled;
        setEnabled(next);
        await toggleRetailStatus(id, next);
      }}
      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase transition-all ${
        enabled ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-400"
      }`}
    >
      {enabled ? "Visible in Shop" : "Hidden"}
    </button>
  );
}