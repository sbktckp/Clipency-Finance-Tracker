"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CurrencyMode = "INR" | "USD"

type CurrencyContextValue = {
  currency: CurrencyMode
  setCurrency: (currency: CurrencyMode) => void
  usdInrRate: number | null
  loadingRate: boolean
  rateLabel: string
  rateAvailable: boolean
  formatMoney: (amountInInr: number) => string
  convertMoney: (amountInInr: number) => number | null
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyMode>("INR")
  const [usdInrRate, setUsdInrRate] = useState<number | null>(null)
  const [loadingRate, setLoadingRate] = useState(true)
  const [rateDate, setRateDate] = useState("")
  const [rateSource, setRateSource] = useState("")
  const [rateError, setRateError] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("clipency-currency-mode")

    if (saved === "USD" || saved === "INR") {
      setCurrencyState(saved)
    }

    fetchRate()

    const interval = window.setInterval(() => {
      fetchRate()
    }, 60 * 60 * 1000)

    return () => window.clearInterval(interval)
  }, [])

  function setCurrency(value: CurrencyMode) {
    setCurrencyState(value)
    localStorage.setItem("clipency-currency-mode", value)
  }

  async function fetchJson(url: string) {
    const response = await fetch(url, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`FX API failed: ${url}`)
    }

    return response.json()
  }

  async function fetchRate() {
    setLoadingRate(true)
    setRateError(false)

    try {
      const primary = await fetchJson("https://open.er-api.com/v6/latest/USD")
      const primaryRate = Number(primary?.rates?.INR)

      if (primaryRate > 0) {
        setUsdInrRate(primaryRate)
        setRateDate(primary?.time_last_update_utc || "")
        setRateSource("API")
        return
      }

      throw new Error("Primary FX rate missing INR")
    } catch (primaryError) {
      console.error("Primary currency rate fetch failed:", primaryError)

      try {
        const backup = await fetchJson("https://api.frankfurter.app/latest?from=USD&to=INR")
        const backupRate = Number(backup?.rates?.INR)

        if (backupRate > 0) {
          setUsdInrRate(backupRate)
          setRateDate(backup?.date || "")
          setRateSource("API Backup")
          return
        }

        throw new Error("Backup FX rate missing INR")
      } catch (backupError) {
        console.error("Backup currency rate fetch failed:", backupError)

        setUsdInrRate(null)
        setRateDate("")
        setRateSource("")
        setRateError(true)
      }
    } finally {
      setLoadingRate(false)
    }
  }

  function convertMoney(amountInInr: number) {
    const amount = Number(amountInInr || 0)

    if (currency === "USD") {
      if (!usdInrRate || usdInrRate <= 0) return null
      return amount / usdInrRate
    }

    return amount
  }

  function formatMoney(amountInInr: number) {
    const converted = convertMoney(amountInInr)

    if (converted === null) {
      return "FX unavailable"
    }

    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "USD" ? 2 : 0,
    }).format(Number(converted || 0))
  }

  const rateAvailable = Boolean(usdInrRate && usdInrRate > 0)

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      usdInrRate,
      loadingRate,
      rateAvailable,
      rateLabel: loadingRate
        ? "Fetching live FX from API..."
        : rateError || !rateAvailable
          ? "FX API unavailable. USD conversion paused."
          : `${rateSource}: 1 USD ≈ ₹${usdInrRate?.toFixed(2)}${rateDate ? ` · ${rateDate}` : ""}`,
      formatMoney,
      convertMoney,
    }),
    [currency, usdInrRate, loadingRate, rateDate, rateSource, rateError, rateAvailable]
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
