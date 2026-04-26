"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"
import { PageSkeleton } from "@/components/loading-skeleton"

type Credit = {
  id: string
  source_type: "client_payment" | "investment"
  client_name: string | null
  campaign_name: string | null
  amount: number
  platform_fee_amount: number
  static_fund_amount: number
  dynamic_fund_amount: number
  payment_date: string
}

type Debit = {
  id: string
  debit_type: string
  recipient_name: string | null
  campaign_name: string | null
  amount: number
  fund_type: "static" | "dynamic"
  payment_date: string
}

export default function ReportsPage() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [datePreset, setDatePreset] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    setLoading(true)
    setError("")

    const [creditsResult, debitsResult] = await Promise.all([
      supabase
        .from("finance_credits")
        .select("id, source_type, client_name, campaign_name, amount, platform_fee_amount, static_fund_amount, dynamic_fund_amount, payment_date")
        .order("payment_date", { ascending: false }),

      supabase
        .from("finance_debits")
        .select("id, debit_type, recipient_name, campaign_name, amount, fund_type, payment_date")
        .order("payment_date", { ascending: false }),
    ])

    if (creditsResult.error) {
      setError(creditsResult.error.message)
    } else {
      setCredits(creditsResult.data || [])
    }

    if (debitsResult.error) {
      setError(debitsResult.error.message)
    } else {
      setDebits(debitsResult.data || [])
    }

    setLoading(false)
  }



  function getActiveDateRange() {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")

    if (datePreset === "today") {
      const date = `${yyyy}-${mm}-${dd}`
      return { from: date, to: date }
    }

    if (datePreset === "this_month") {
      return { from: `${yyyy}-${mm}-01`, to: `${yyyy}-${mm}-${dd}` }
    }

    if (datePreset === "last_month") {
      const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

      return {
        from: firstDayLastMonth.toISOString().slice(0, 10),
        to: lastDayLastMonth.toISOString().slice(0, 10),
      }
    }

    if (datePreset === "custom") {
      return { from: startDate, to: endDate }
    }

    return { from: "", to: "" }
  }

  const filteredCredits = useMemo(() => {
    const { from, to } = getActiveDateRange()

    return credits.filter((credit) => {
      const date = credit.payment_date || ""
      const afterStart = !from || date >= from
      const beforeEnd = !to || date <= to

      return afterStart && beforeEnd
    })
  }, [credits, datePreset, startDate, endDate])

  const filteredDebits = useMemo(() => {
    const { from, to } = getActiveDateRange()

    return debits.filter((debit) => {
      const date = debit.payment_date || ""
      const afterStart = !from || date >= from
      const beforeEnd = !to || date <= to

      return afterStart && beforeEnd
    })
  }, [debits, datePreset, startDate, endDate])

  const report = useMemo(() => {
    const totalCredits = filteredCredits.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const totalDebits = filteredDebits.reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const staticCredits = filteredCredits.reduce((sum, item) => sum + Number(item.static_fund_amount || 0), 0)
    const dynamicCredits = filteredCredits.reduce((sum, item) => sum + Number(item.dynamic_fund_amount || 0), 0)
    const platformFees = filteredCredits.reduce((sum, item) => sum + Number(item.platform_fee_amount || 0), 0)

    const staticDebits = debits
      .filter((item) => item.fund_type === "static")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const dynamicDebits = debits
      .filter((item) => item.fund_type === "dynamic")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const investments = credits
      .filter((item) => item.source_type === "investment")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const clientPayments = credits
      .filter((item) => item.source_type === "client_payment")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const staticFund = staticCredits - staticDebits
    const dynamicFund = dynamicCredits - dynamicDebits
    const netPosition = staticFund + dynamicFund

    const campaignNames = new Set(
      credits
        .filter((item) => item.campaign_name)
        .map((item) => item.campaign_name)
    )

    const dynamicExposure =
      dynamicCredits > 0 ? Math.round((dynamicDebits / dynamicCredits) * 100) : 0

    const staticBurn =
      staticCredits > 0 ? Math.round((staticDebits / staticCredits) * 100) : 0

    return {
      totalCredits,
      totalDebits,
      staticCredits,
      dynamicCredits,
      platformFees,
      staticDebits,
      dynamicDebits,
      investments,
      clientPayments,
      staticFund,
      dynamicFund,
      netPosition,
      campaignCount: campaignNames.size,
      dynamicExposure,
      staticBurn,
    }
  }, [filteredCredits, filteredDebits])

  function downloadCSV(filename: string, rows: Record<string, any>[]) {
    if (rows.length === 0) {
      alert("No data available to export.")
      return
    }

    const headers = Object.keys(rows[0])

    const escapeCSV = (value: any) => {
      const clean = value === null || value === undefined ? "" : String(value)
      return `"${clean.replaceAll('"', '""')}"`
    }

    const csv = [
      headers.join(","),
      ...rows.map((row) => headers.map((header) => escapeCSV(row[header])).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
  }

  function exportCreditsCSV() {
    downloadCSV(
      `clipency-credits-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredCredits.map((credit) => ({
        id: credit.id,
        type: credit.source_type,
        client: credit.client_name || "",
        campaign: credit.campaign_name || "",
        amount: credit.amount,
        platform_fee: credit.platform_fee_amount,
        static_fund: credit.static_fund_amount,
        dynamic_fund: credit.dynamic_fund_amount,
        payment_date: credit.payment_date,
      }))
    )
  }

  function exportDebitsCSV() {
    downloadCSV(
      `clipency-debits-${new Date().toISOString().slice(0, 10)}.csv`,
      filteredDebits.map((debit) => ({
        id: debit.id,
        type: debit.debit_type,
        recipient: debit.recipient_name || "",
        campaign: debit.campaign_name || "",
        fund_type: debit.fund_type,
        amount: debit.amount,
        payment_date: debit.payment_date,
      }))
    )
  }

  function exportTransactionsCSV() {
    downloadCSV(
      `clipency-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      recentTransactions.map((item) => ({
        type: item.type,
        category: item.category,
        party: item.party,
        campaign: item.campaign,
        amount: item.amount,
        direction: item.direction,
        date: item.date,
      }))
    )
  }

  const recentTransactions = useMemo(() => {
    const creditRows = credits.map((item) => ({
      id: `credit-${item.id}`,
      type: "Credit",
      category: item.source_type.replace("_", " "),
      party: item.client_name || "Investment",
      campaign: item.campaign_name || "—",
      amount: Number(item.amount || 0),
      date: item.payment_date,
      direction: "in",
    }))

    const debitRows = debits.map((item) => ({
      id: `debit-${item.id}`,
      type: "Debit",
      category: item.debit_type.replaceAll("_", " "),
      party: item.recipient_name || "—",
      campaign: item.campaign_name || "—",
      amount: Number(item.amount || 0),
      date: item.payment_date,
      direction: "out",
    }))

    return [...creditRows, ...debitRows]
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 12)
  }, [filteredCredits, filteredDebits])

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-x-hidden bg-[#02030a] px-6 py-8 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                ← Back to Dashboard
              </Link>

              <p className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                Executive Reports
              </p>

              <h1 className="mt-4 text-3xl font-bold">Reports</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Live financial reporting from Credits, Debits, Funds, and Campaign Finance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportCreditsCSV}
                className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300/40 hover:bg-emerald-500/20"
              >
                Export Credits
              </button>

              <button
                onClick={exportDebitsCSV}
                className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-300/40 hover:bg-rose-500/20"
              >
                Export Debits
              </button>

              <button
                onClick={exportTransactionsCSV}
                className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-500/20"
              >
                Export Transactions
              </button>

              <button
                onClick={fetchReports}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-400/40 hover:bg-violet-500/10"
              >
                Refresh Report
              </button>
            </div>
          </div>

          <div className="mb-8 overflow-safe overflow-safe overflow-safe rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="finance-filter-grid">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Report Period</label>
                <select
                  value={datePreset}
                  onChange={(e) => {
                    setDatePreset(e.target.value)
                    if (e.target.value !== "custom") {
                      setStartDate("")
                      setEndDate("")
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">From</label>
                <input
                  type="date"
                  value={startDate}
                  disabled={datePreset !== "custom"}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">To</label>
                <input
                  type="date"
                  value={endDate}
                  disabled={datePreset !== "custom"}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setDatePreset("all")
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
              Report showing {filteredCredits.length} credit entries and {filteredDebits.length} debit entries.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="overflow-safe overflow-safe overflow-safe rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-slate-400">
              Loading reports...
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Net Central Position" value={formatINR(report.netPosition)} color="from-emerald-400 to-teal-500" />
                <Metric label="Static Fund" value={formatINR(report.staticFund)} color="from-violet-500 to-fuchsia-500" />
                <Metric label="Dynamic Fund" value={formatINR(report.dynamicFund)} color="from-cyan-400 to-sky-500" />
                <Metric label="Platform Fees" value={formatINR(report.platformFees)} color="from-amber-300 to-orange-400" />
              </div>

              <div className="mb-8 grid gap-6 xl:grid-cols-3">
                <ReportCard title="Credit Report">
                  <Row label="Total Credits" value={formatINR(report.totalCredits)} />
                  <Row label="Client Payments" value={formatINR(report.clientPayments)} />
                  <Row label="Investments" value={formatINR(report.investments)} />
                  <Row label="Platform Fees Earned" value={formatINR(report.platformFees)} />
                </ReportCard>

                <ReportCard title="Debit Report">
                  <Row label="Total Debits" value={formatINR(report.totalDebits)} danger />
                  <Row label="Static Debits" value={formatINR(report.staticDebits)} danger />
                  <Row label="Dynamic Debits" value={formatINR(report.dynamicDebits)} danger />
                  <Row label="Static Burn" value={`${report.staticBurn}%`} danger={report.staticBurn > 50} />
                </ReportCard>

                <ReportCard title="Campaign Exposure">
                  <Row label="Campaigns Tracked" value={String(report.campaignCount)} />
                  <Row label="Dynamic Allocation" value={formatINR(report.dynamicCredits)} />
                  <Row label="Dynamic Debits" value={formatINR(report.dynamicDebits)} danger />
                  <Row label="Dynamic Exposure" value={`${report.dynamicExposure}%`} danger={report.dynamicExposure > 70} />
                </ReportCard>
              </div>

              <div className="mb-8 grid gap-6 xl:grid-cols-2">
                <div className="overflow-safe overflow-safe overflow-safe rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20">
                  <h2 className="text-xl font-bold">Fund Health</h2>
                  <p className="mt-1 text-sm text-slate-400">Operational reading of the finance system.</p>

                  <div className="mt-6 space-y-5">
                    <ProgressRow label="Static Fund Remaining" value={safePercent(report.staticFund, report.staticCredits)} />
                    <ProgressRow label="Dynamic Fund Remaining" value={safePercent(report.dynamicFund, report.dynamicCredits)} />
                    <ProgressRow label="Overall Debit Pressure" value={safePercent(report.totalDebits, report.totalCredits)} />
                  </div>
                </div>

                <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 to-cyan-500/10 p-6 shadow-2xl shadow-violet-950/30">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Finance Interpretation
                  </p>
                  <h2 className="mt-4 text-2xl font-bold">Live Control Summary</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    This report is generated directly from Supabase entries. Additions or deletions in Credits and Debits will automatically update the dashboard, funds page, campaign finance, and this report.
                  </p>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                    {report.dynamicFund < 0
                      ? "Warning: Dynamic Fund is overdrawn. Campaign payouts/refunds exceed campaign allocations."
                      : "Dynamic Fund is within available campaign allocation."}
                  </div>
                </div>
              </div>

              <div className="overflow-safe overflow-safe overflow-safe rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Recent Transactions</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Latest credits and debits across the finance system.
                    </p>
                  </div>
                </div>

                <div className="scroll-safe mt-6 rounded-2xl border border-white/10">
                  {recentTransactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No transactions yet.</div>
                  ) : (
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Type</th>
                          <th className="px-5 py-3">Category</th>
                          <th className="px-5 py-3">Party</th>
                          <th className="px-5 py-3">Campaign</th>
                          <th className="px-5 py-3">Amount</th>
                          <th className="px-5 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map((item) => (
                          <tr key={item.id} className="border-t border-white/5 text-slate-300">
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs ${
                                  item.direction === "in"
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-rose-500/10 text-rose-300"
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="px-5 py-4 capitalize">{item.category}</td>
                            <td className="px-5 py-4">{item.party}</td>
                            <td className="px-5 py-4">{item.campaign}</td>
                            <td className={`px-5 py-4 font-semibold ${item.direction === "in" ? "text-emerald-300" : "text-rose-300"}`}>
                              {item.direction === "in" ? "+" : "-"}
                              {formatINR(item.amount)}
                            </td>
                            <td className="px-5 py-4">{item.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </AppShell>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden overflow-safe overflow-safe overflow-safe rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 max-w-full truncate bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent 2xl:text-3xl`}>
        {value}
      </p>
    </div>
  )
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-safe overflow-safe overflow-safe rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-6 space-y-4 text-sm">{children}</div>
    </div>
  )
}

function Row({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className={danger ? "font-semibold text-rose-300" : "font-semibold text-white"}>
        {value}
      </span>
    </div>
  )
}

function ProgressRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
          style={{ width: value }}
        />
      </div>
    </div>
  )
}

function safePercent(value: number, total: number) {
  if (!total || total <= 0) return "0%"
  const percentage = Math.max(0, Math.min(100, Math.round((value / total) * 100)))
  return `${percentage}%`
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
