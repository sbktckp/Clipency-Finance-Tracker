"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

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

export default function FundsPage() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFundData()
  }, [])

  async function fetchFundData() {
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

  const totals = useMemo(() => {
    const totalCredits = credits.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const totalDebits = debits.reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const staticCredits = credits.reduce(
      (sum, item) => sum + Number(item.static_fund_amount || 0),
      0
    )

    const dynamicCredits = credits.reduce(
      (sum, item) => sum + Number(item.dynamic_fund_amount || 0),
      0
    )

    const platformFees = credits.reduce(
      (sum, item) => sum + Number(item.platform_fee_amount || 0),
      0
    )

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
    const netCentralPosition = staticFund + dynamicFund

    return {
      totalCredits,
      totalDebits,
      staticCredits,
      dynamicCredits,
      staticDebits,
      dynamicDebits,
      platformFees,
      investments,
      clientPayments,
      staticFund,
      dynamicFund,
      netCentralPosition,
    }
  }, [credits, debits])

  const recentMovements = useMemo(() => {
    const creditMovements = credits.map((item) => ({
      id: `credit-${item.id}`,
      type: "Credit",
      title:
        item.source_type === "client_payment"
          ? item.client_name || "Client Payment"
          : "Investment",
      campaign: item.campaign_name || "—",
      fund:
        item.source_type === "client_payment"
          ? "Static + Dynamic"
          : "Static",
      amount: Number(item.amount || 0),
      date: item.payment_date,
      direction: "in",
    }))

    const debitMovements = debits.map((item) => ({
      id: `debit-${item.id}`,
      type: "Debit",
      title: item.recipient_name || item.debit_type.replaceAll("_", " "),
      campaign: item.campaign_name || "—",
      fund: item.fund_type === "static" ? "Static" : "Dynamic",
      amount: Number(item.amount || 0),
      date: item.payment_date,
      direction: "out",
    }))

    return [...creditMovements, ...debitMovements]
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 10)
  }, [credits, debits])

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-x-hidden bg-[#02030a] px-6 py-8 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%),radial-gradient(circle_at_center,rgba(217,70,239,0.08),transparent_40%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                ← Back to Dashboard
              </Link>

              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Central Fund Control
              </p>

              <h1 className="mt-4 text-3xl font-bold">Funds</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Live central fund breakdown. Every credit and debit entry reflects here automatically.
              </p>
            </div>

            <button
              onClick={fetchFundData}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-slate-400">
              Loading fund data...
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  label="Static Fund"
                  value={formatINR(totals.staticFund)}
                  subtext={`${formatINR(totals.staticCredits)} in - ${formatINR(totals.staticDebits)} out`}
                  color="from-violet-500 to-fuchsia-500"
                />
                <Metric
                  label="Dynamic Fund"
                  value={formatINR(totals.dynamicFund)}
                  subtext={`${formatINR(totals.dynamicCredits)} in - ${formatINR(totals.dynamicDebits)} out`}
                  color="from-cyan-400 to-sky-500"
                />
                <Metric
                  label="Net Central Position"
                  value={formatINR(totals.netCentralPosition)}
                  subtext="Static Fund + Dynamic Fund"
                  color="from-emerald-400 to-teal-500"
                />
                <Metric
                  label="Platform Fees"
                  value={formatINR(totals.platformFees)}
                  subtext="Company revenue from client payments"
                  color="from-amber-300 to-orange-400"
                />
              </div>

              <div className="mb-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 via-fuchsia-500/10 to-black/20 p-7 shadow-2xl shadow-violet-950/30">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">
                      Company-Owned Money
                    </p>

                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Static Fund</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                          Company-owned operating balance built from investments and platform fees.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-violet-400/20 bg-black/25 px-5 py-4 shadow-xl shadow-violet-950/20">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available</p>
                        <p className="mt-1 whitespace-nowrap bg-gradient-to-r from-violet-300 to-fuchsia-400 bg-clip-text text-3xl font-black text-transparent">
                          {formatINR(totals.staticFund)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                    <Row label="Static Credits" value={formatINR(totals.staticCredits)} />
                    <Row label="Static Debits" value={`-${formatINR(totals.staticDebits)}`} danger />
                    <Row label="Investments" value={formatINR(totals.investments)} />
                    <Row label="Platform Fees" value={formatINR(totals.platformFees)} />
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-600/15 via-sky-500/10 to-black/20 p-7 shadow-2xl shadow-cyan-950/20">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Client/Campaign Money
                    </p>

                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Dynamic Fund</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                          Campaign-linked client money. Trackable, refundable, and not free company balance.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/20 bg-black/25 px-5 py-4 shadow-xl shadow-cyan-950/20">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Available</p>
                        <p className="mt-1 whitespace-nowrap bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-3xl font-black text-transparent">
                          {formatINR(totals.dynamicFund)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                    <Row label="Client Payments" value={formatINR(totals.clientPayments)} />
                    <Row label="Dynamic Credits" value={formatINR(totals.dynamicCredits)} />
                    <Row label="Dynamic Debits" value={`-${formatINR(totals.dynamicDebits)}`} danger />
                    <Row label="Remaining Dynamic Balance" value={formatINR(totals.dynamicFund)} />
                  </div>
                </div>
              </div>

              <div className="mb-8 rounded-3xl border border-amber-400/25 bg-amber-500/10 p-6 text-amber-200">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                  Fund Accounting Logic
                </p>
                <div className="mt-4 grid gap-4 text-sm leading-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="font-bold text-white">Client Payment</p>
                    <p className="mt-1 text-slate-300">
                      Platform fee moves to Static Fund. Remaining client campaign money moves to Dynamic Fund.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="font-bold text-white">Investment</p>
                    <p className="mt-1 text-slate-300">
                      Investment directly increases Static Fund because it is company-owned capital.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="font-bold text-white">Static Debit</p>
                    <p className="mt-1 text-slate-300">
                      Company expenses such as salaries, tools, subscriptions, and operations reduce Static Fund.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="font-bold text-white">Dynamic Debit</p>
                    <p className="mt-1 text-slate-300">
                      Campaign payouts, refunds, and campaign-linked costs reduce Dynamic Fund.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Recent Fund Movements</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Latest credits and debits affecting the central fund.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href="/credits"
                      className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-400/20"
                    >
                      Add Credit
                    </Link>
                    <Link
                      href="/debits"
                      className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-400/20"
                    >
                      Add Debit
                    </Link>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                  {recentMovements.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No fund movements yet.
                    </div>
                  ) : (
                    <table className="w-full min-w-[820px] text-left text-sm">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Type</th>
                          <th className="px-5 py-3">Party</th>
                          <th className="px-5 py-3">Campaign</th>
                          <th className="px-5 py-3">Fund</th>
                          <th className="px-5 py-3">Amount</th>
                          <th className="px-5 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMovements.map((item) => (
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
                            <td className="px-5 py-4">{item.title}</td>
                            <td className="px-5 py-4">{item.campaign}</td>
                            <td className="px-5 py-4">{item.fund}</td>
                            <td
                              className={`px-5 py-4 font-semibold ${
                                item.direction === "in" ? "text-emerald-300" : "text-rose-300"
                              }`}
                            >
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

function Metric({
  label,
  value,
  subtext,
  color,
}: {
  label: string
  value: string
  subtext: string
  color: string
}) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 break-words bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent`}>
        {value}
      </p>
      <p className="mt-3 text-xs text-slate-500">{subtext}</p>
    </div>
  )
}

function Row({
  label,
  value,
  danger = false,
}: {
  label: string
  value: string
  danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className={danger ? "font-semibold text-rose-300" : "font-semibold text-white"}>
        {value}
      </span>
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
