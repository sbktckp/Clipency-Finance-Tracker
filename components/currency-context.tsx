"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CurrencyMode = "INR" | "USD"

type CurrencyContextValue = {
  currency: CurrencyMode
  setCurrency: (currency: CurrencyMode) => void
  usdInrRate: number
  loadingRate: boolean
  rateLabel: string
  formatMoney: (amountInInr: number) => string
  convertMoney: (amountInInr: number) => number
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyMode>("INR")
  const [usdInrRate, setUsdInrRate] = useState(83)
  const [loadingRate, setLoadingRate] = useState(true)
  const [rateDate, setRateDate] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("clipency-currency-mode")

    if (saved === "USD" || saved === "INR") {
      setCurrencyState(saved)
    }

    fetchRate()
  }, [])

  function setCurrency(value: CurrencyMode) {
    setCurrencyState(value)
    localStorage.setItem("clipency-currency-mode", value)
  }

  async function fetchRate() {
    try {
      setLoadingRate(true)

      const response = await fetch(
        "https://api.frankfurter.dev/v2/rates?base=USD&quotes=INR",
        { cache: "no-store" }
      )

      if (!response.ok) {
        throw new Error("Could not fetch exchange rate.")
      }

      const data = await response.json()
      const rate = Number(data?.rates?.INR)

      if (rate > 0) {
        setUsdInrRate(rate)
        setRateDate(data?.date || "")
      }
    } catch (error) {
      console.error("Currency rate fetch failed:", error)
    } finally {
      setLoadingRate(false)
    }
  }

  function convertMoney(amountInInr: number) {
    const amount = Number(amountInInr || 0)

    if (currency === "USD") {
      return amount / usdInrRate
    }

    return amount
  }

  function formatMoney(amountInInr: number) {
    const converted = convertMoney(amountInInr)

    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(Number(converted || 0))
  }

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      usdInrRate,
      loadingRate,
      rateLabel: loadingRate
        ? "Fetching live FX..."
        : `1 USD ≈ ₹${usdInrRate.toFixed(2)}${rateDate ? ` · ${rateDate}` : ""}`,
      formatMoney,
      convertMoney,
    }),
    [currency, usdInrRate, loadingRate, rateDate]
  )

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider")
  }

  return context
}
