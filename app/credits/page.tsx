"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"
import { PageSkeleton } from "@/components/loading-skeleton"
import { useCurrency } from "@/components/currency-context"

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
  const [currentRole, setCurrentRole] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [sourceType, setSourceType] = useState<"client_payment" | "investment">("client_payment")
  const [clientName, setClientName] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [amount, setAmount] = useState("")
  const [platformFeePercentage, setPlatformFeePercentage] = useState("20")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [editingCreditId, setEditingCreditId] = useState<string | null>(null)

  async function loadCurrentRole() {
    const { data: sessionData } = await supabase.auth.getSession()
    const email = sessionData.session?.user.email

    if (!email) return

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single()

    setCurrentRole(profile?.role || null)
  }

  useEffect(() => {
    loadCurrentRole()
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

  function startEditCredit(credit: Credit) {
    setEditingCreditId(credit.id)
    setSourceType(credit.source_type)
    setClientName(credit.client_name || "")
    setCampaignName(credit.campaign_name || "")
    setAmount(String(Math.round(Number(credit.amount || 0))))
    const feePercentage =
      Number(credit.amount || 0) > 0
        ? Math.round((Number(credit.platform_fee_amount || 0) / Number(credit.amount || 0)) * 100)
        : 0

    setPlatformFeePercentage(String(feePercentage))
    setPaymentDate(credit.payment_date)
    setNotes(credit.notes || "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetCreditForm() {
    setEditingCreditId(null)
    setSourceType("client_payment")
    setClientName("")
    setCampaignName("")
    setAmount("")
    setPlatformFeePercentage("20")
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setNotes("")
  }

  async function deleteCredit(id: string) {
    const confirmed = window.confirm("Delete this credit entry?")
    if (!confirmed) return

    setError("")

    const { error } = await supabase
      .from("finance_credits")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()

    await supabase.from("finance_audit_logs").insert({
      user_id: sessionData.session?.user.id,
      user_email: sessionData.session?.user.email,
      action: "credit_deleted",
      entity_type: "credit",
      entity_id: id,
      description: "Deleted credit entry",
    })

    await fetchCredits()
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

    const userEmail = sessionData.session?.user.email

    if (userEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", userEmail)
        .single()

      setCurrentRole(profile?.role || null)
    }

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

  const filteredCredits = useMemo(() => {
    return credits.filter((credit) => {
      const search = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !search ||
        credit.source_type.toLowerCase().includes(search) ||
        (credit.client_name || "").toLowerCase().includes(search) ||
        (credit.campaign_name || "").toLowerCase().includes(search) ||
        (credit.notes || "").toLowerCase().includes(search)

      const creditDate = credit.payment_date || ""

      const matchesStartDate = !startDate || creditDate >= startDate
      const matchesEndDate = !endDate || creditDate <= endDate

      return matchesSearch && matchesStartDate && matchesEndDate
    })
  }, [credits, searchTerm, startDate, endDate])

  const totals = useMemo(() => {
    return filteredCredits.reduce(
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
  }, [filteredCredits])

  return (
    <AppShell>
      <section className="mobile-page relative min-h-screen overflow-x-hidden bg-[#02030a] px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="mobile-container relative z-10 mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                ← Back to Dashboard
              </Link>

              <div>
                <p className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Credit Control
                </p>
                <h1 className="mt-4 gradient-title gradient-title text-3xl font-bold">Credits</h1>
                <p className="mt-2 max-w-4xl text-slate-400">
                  Record client payments and investments. Platform fee goes to Static Fund; remaining campaign money goes to Dynamic Fund.
                </p>
              </div>
            </div>
          </div>

          <div className="mobile-grid mb-8">
            <Metric label="Total Credits" value={formatMoney(totals.totalCredits)} color="from-emerald-400 to-teal-500" />
            <Metric label="Static Allocation" value={formatMoney(totals.staticFund)} color="from-violet-500 to-fuchsia-500" />
            <Metric label="Dynamic Allocation" value={formatMoney(totals.dynamicFund)} color="from-cyan-400 to-sky-500" />
            <Metric label="Platform Fees" value={formatMoney(totals.platformFees)} color="from-amber-300 to-orange-400" />
          </div>

          <div className="mb-8 overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="finance-filter-grid">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Search Credits</label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search client, campaign, type, notes..."
                  className="finance-input finance-control-height"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="finance-input finance-control-height"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="finance-input finance-control-height"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("")
                    setStartDate("")
                    setEndDate("")
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredCredits.length} of {credits.length} credit entries.
            </p>
          </div>

          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
            <form onSubmit={addCredit} className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">{editingCreditId ? "Edit Credit" : "Add Credit"}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {editingCreditId ? "Update the selected credit entry." : "Create a new credit entry."}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Credit Type</label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as "client_payment" | "investment")}
                    className="finance-input finance-control-height"
                  >
                    <option value="client_payment">Client Payment</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                {sourceType === "client_payment" && (
                  <>
                    <Input label="Client Name" value={clientName} onChange={setClientName} placeholder="Client / Brand name" />
                    <Input label="Campaign Name" value={campaignName} onChange={setCampaignName} placeholder="Campaign name" />

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">Platform Fee %</label>
                      <input
                        type="number"
                        value={platformFeePercentage}
                        onChange={(e) => setPlatformFeePercentage(e.target.value)}
                        className="finance-input finance-control-height"
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
                    className="finance-input finance-control-height"
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
                    className="finance-input finance-control-height"
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
                  className="w-full premium-button premium-button rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-bold shadow-lg shadow-violet-900/30 transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingCreditId ? "Update Credit" : "Add Credit"}
                </button>

                {editingCreditId && (
                  <button
                    type="button"
                    onClick={resetCreditForm}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="min-w-0 overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">Credit Ledger</h2>
              <p className="mt-1 text-sm text-slate-400">Live entries from Supabase.</p>

              <div className="scroll-safe mt-6 rounded-2xl border border-white/10">
                {loading ? (
                  <p className="p-6 text-slate-400">Loading credits...</p>
                ) : filteredCredits.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    No credit entries match your current filters.
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Campaign</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Fee</th>
                        <th className="px-4 py-3">Dynamic</th>
                        <th className="px-4 py-3">Static</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCredits.map((credit) => (
                        <tr key={credit.id} className="border-t border-white/5 text-slate-300">
                          <td className="px-4 py-4">
                            <span className="whitespace-nowrap rounded-full bg-white/5 px-3 py-1 text-xs">
                              {credit.source_type.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-4">{credit.client_name || "—"}</td>
                          <td className="px-4 py-4">{credit.campaign_name || "—"}</td>
                          <td className="px-4 py-4 font-semibold text-emerald-300">{formatMoney(credit.amount)}</td>
                          <td className="px-4 py-4">{formatMoney(credit.platform_fee_amount)}</td>
                          <td className="px-4 py-4 text-cyan-300">{formatMoney(credit.dynamic_fund_amount)}</td>
                          <td className="px-4 py-4 text-violet-300">{formatMoney(credit.static_fund_amount)}</td>
                          <td className="px-4 py-4">{credit.payment_date}</td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditCredit(credit)}
                                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                              >
                                Edit
                              </button>
                              {currentRole === "senior_management" && (
                                <button
                                  onClick={() => deleteCredit(credit.id)}
                                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
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

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="finance-input finance-control-height"
        placeholder={placeholder}
      />
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 break-words bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
