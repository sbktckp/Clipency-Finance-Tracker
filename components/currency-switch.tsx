"use client"

import { useCurrency } from "@/components/currency-context"

export function CurrencySwitch() {
  const { currency, setCurrency, rateLabel, rateAvailable, loadingRate } = useCurrency()

  return (
    <div className="currency-switch compact-glass">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCurrency("INR")}
          className={`currency-toggle-btn ${
            currency === "INR" ? "currency-toggle-active-inr" : ""
          }`}
        >
          ₹
        </button>

        <button
          type="button"
          disabled={!rateAvailable || loadingRate}
          onClick={() => setCurrency("USD")}
          className={`currency-toggle-btn ${
            currency === "USD" ? "currency-toggle-active-usd" : ""
          } disabled:cursor-not-allowed disabled:opacity-45`}
        >
          $
        </button>
      </div>

      <p className="currency-rate-label">
        {rateLabel}
      </p>
    </div>
  )
}
