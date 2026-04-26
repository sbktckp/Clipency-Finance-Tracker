"use client"

import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

type Credit = {
  id: string
  source_type: "client_payment" | "investment"
  client_name: string | null
  campaign_name: string | null
  amount: number
  platform_fee_percentage: number
  platform_fee_amount: number
  dynamic_fund_amount: number
  static_fund_amount: number
  payment_date: string
  notes: string | null
  created_at: string
}

export default function CreditsPage() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [sourceType, setSourceType] = useState<"client_payment" | "investment">("client_payment")
  const [clientName, setClientName] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [amount, setAmount] = useState("")
  const [platformFeePercentage, setPlatformFeePercentage] = useState("20")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchCredits()
  }, [])

  async function fetchCredits() {
    setLoading(true)
    const { data, error } = await supabase
      .from("finance_credits")
      .select("*")
      .order("payment_date", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setCredits(data || [])
    }

    setLoading(false)
  }

  async function addCredit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const numericAmount = Number(amount)
    const feePercent = sourceType === "client_payment" ? Number(platformFeePercentage) : 0

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid amount.")
      setSaving(false)
      return
    }

    const platformFeeAmount =
      sourceType === "client_payment" ? (numericAmount * feePercent) / 100 : 0

    const dynamicFundAmount =
      sourceType === "client_payment" ? numericAmount - platformFeeAmount : 0

    const staticFundAmount =
      sourceType === "client_payment" ? platformFeeAmount : numericAmount

    const { data: sessionData } = await supabase.auth.getSession()

    const { error } = await supabase.from("finance_credits").insert({
      source_type: sourceType,
      client_name: sourceType === "client_payment" ? clientName : null,
      campaign_name: sourceType === "client_payment" ? campaignName : null,
      amount: numericAmount,
      platform_fee_percentage: feePercent,
      platform_fee_amount: platformFeeAmount,
      dynamic_fund_amount: dynamicFundAmount,
      static_fund_amount: staticFundAmount,
      payment_date: paymentDate,
      notes,
      created_by: sessionData.session?.user.id,
    })

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setClientName("")
    setCampaignName("")
    setAmount("")
    setNotes("")
    await fetchCredits()
    setSaving(false)
  }

  const totals = useMemo(() => {
    return credits.reduce(
      (acc, item) => {
        acc.totalCredits += Number(item.amount || 0)
        acc.staticFund += Number(item.static_fund_amount || 0)
        acc.dynamicFund += Number(item.dynamic_fund_amount || 0)
        acc.platformFees += Number(item.platform_fee_amount || 0)
        return acc
      },
      {
        totalCredits: 0,
        staticFund: 0,
        dynamicFund: 0,
        platformFees: 0,
      }
    )
  }, [credits])

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-hidden bg-[#02030a] p-8 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="relative z-10">
          <div className="mb-8">
            <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Credit Control
            </p>
            <h1 className="mt-4 text-3xl font-bold">Credits</h1>
            <p className="mt-2 text-slate-400">
              Record client payments and investments. Platform fee goes to Static Fund; remaining campaign money goes to Dynamic Fund.
            </p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Metric label="Total Credits" value={formatINR(totals.totalCredits)} color="from-emerald-400 to-teal-500" />
            <Metric label="Static Allocation" value={formatINR(totals.staticFund)} color="from-violet-500 to-fuchsia-500" />
            <Metric label="Dynamic Allocation" value={formatINR(totals.dynamicFund)} color="from-cyan-400 to-sky-500" />
            <Metric label="Platform Fees" value={formatINR(totals.platformFees)} color="from-amber-300 to-orange-400" />
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <form onSubmit={addCredit} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">Add Credit</h2>
              <p className="mt-1 text-sm text-slate-400">Create a new credit entry.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Credit Type</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as "client_payment" | "investment")}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    <option value="client_payment">Client Payment</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                {sourceType === "client_payment" && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Client Name</label>
                      <input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                        placeholder="Client / Brand name"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Campaign Name</label>
                      <input
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                        placeholder="Campaign name"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Platform Fee %</label>
                      <input
                        type="number"
                        value={platformFeePercentage}
                        onChange={(e) => setPlatformFeePercentage(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                        placeholder="20"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                    placeholder="50000"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-24 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                    placeholder="Optional notes"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-bold shadow-lg shadow-violet-900/30 transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Add Credit"}
                </button>
              </div>
            </form>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">Credit Ledger</h2>
              <p className="mt-1 text-sm text-slate-400">Live entries from Supabase.</p>

              <div className="mt-6 overflow-x-auto">
                {loading ? (
                  <p className="text-slate-400">Loading credits...</p>
                ) : credits.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                    No credits added yet.
                  </div>
                ) : (
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="text-xs uppercase tracking-wider text-slate-500">
                      <tr className="border-b border-white/10">
                        <th className="py-3">Type</th>
                        <th>Client</th>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>Platform Fee</th>
                        <th>Dynamic Fund</th>
                        <th>Static Fund</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {credits.map((credit) => (
                        <tr key={credit.id} className="border-b border-white/5 text-slate-300">
                          <td className="py-4">
                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs">
                              {credit.source_type.replace("_", " ")}
                            </span>
                          </td>
                          <td>{credit.client_name || "—"}</td>
                          <td>{credit.campaign_name || "—"}</td>
                          <td className="font-semibold text-emerald-300">{formatINR(credit.amount)}</td>
                          <td>{formatINR(credit.platform_fee_amount)}</td>
                          <td className="text-cyan-300">{formatINR(credit.dynamic_fund_amount)}</td>
                          <td className="text-violet-300">{formatINR(credit.static_fund_amount)}</td>
                          <td>{credit.payment_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
