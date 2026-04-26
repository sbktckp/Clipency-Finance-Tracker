"use client"

import { useCurrency } from "@/components/currency-context"

export function CurrencySwitch() {
  const { currency, setCurrency, rateLabel } = useCurrency()

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-xl shadow-black/10 backdrop-blur">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrency("INR")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            currency === "INR"
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-950/20"
              : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          ₹ INR
        </button>

        <button
          type="button"
          onClick={() => setCurrency("USD")}
          className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
            currency === "USD"
              ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-950/20"
              : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          $ USD
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {rateLabel}
      </p>
    </div>
  )
}
