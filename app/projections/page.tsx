"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { PageSkeleton } from "@/components/loading-skeleton"
import { supabase } from "@/lib/supabase"

type Credit = {
  amount: number
  static_fund_amount: number
  dynamic_fund_amount: number
  platform_fee_amount: number
  payment_date: string
}

type Debit = {
  amount: number
  fund_type: string
  payment_date: string
}

export default function ProjectionsPage() {
  const router = useRouter()

  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [scenarioAmount, setScenarioAmount] = useState("50000")
  const [scenarioType, setScenarioType] = useState<"profit" | "loss">("loss")
  const [scenarioMonths, setScenarioMonths] = useState("3")

  useEffect(() => {
    checkAccessAndFetch()
  }, [])

  async function checkAccessAndFetch() {
    setLoading(true)
    setError("")

    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      router.push("/login")
      return
    }

    const email = sessionData.session.user.email

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single()

    if (profileError || !profile || !["senior_management", "employee"].includes(profile.role)) {
      router.push("/access-restricted")
      return
    }

    await fetchData()
  }

  async function fetchData() {
    setError("")

    const [creditsResult, debitsResult] = await Promise.all([
      supabase
        .from("finance_credits")
        .select("amount, static_fund_amount, dynamic_fund_amount, platform_fee_amount, payment_date"),

      supabase
        .from("finance_debits")
        .select("amount, fund_type, payment_date"),
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

  const projection = useMemo(() => {
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

    const staticDebits = debits
      .filter((item) => item.fund_type === "static")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const dynamicDebits = debits
      .filter((item) => item.fund_type === "dynamic")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const platformFees = credits.reduce(
      (sum, item) => sum + Number(item.platform_fee_amount || 0),
      0
    )

    const staticFund = staticCredits - staticDebits
    const dynamicFund = dynamicCredits - dynamicDebits
    const netCentralPosition = staticFund + dynamicFund
    const netProfit = totalCredits - totalDebits

    const uniqueMonths = new Set([
      ...credits.map((item) => (item.payment_date || "").slice(0, 7)),
      ...debits.map((item) => (item.payment_date || "").slice(0, 7)),
    ])

    const activeMonths = Math.max(uniqueMonths.size, 1)

    const averageMonthlyCredits = totalCredits / activeMonths
    const averageMonthlyDebits = totalDebits / activeMonths
    const averageMonthlyPlatformRevenue = platformFees / activeMonths
    const averageMonthlyBurn = Math.max(averageMonthlyDebits - averageMonthlyPlatformRevenue, 0)

    const runwayMonths =
      averageMonthlyBurn > 0
        ? staticFund / averageMonthlyBurn
        : staticFund > 0
          ? 99
          : 0

    const numericScenarioAmount = Number(scenarioAmount || 0)
    const numericScenarioMonths = Math.max(Number(scenarioMonths || 1), 1)

    const monthlyScenarioImpact =
      scenarioType === "profit"
        ? numericScenarioAmount
        : -numericScenarioAmount

    const totalScenarioImpact = monthlyScenarioImpact * numericScenarioMonths
    const projectedStaticFund = staticFund + totalScenarioImpact
    const projectedNetCentralPosition = netCentralPosition + totalScenarioImpact

    const projectedRunway =
      averageMonthlyBurn > 0
        ? projectedStaticFund / averageMonthlyBurn
        : projectedStaticFund > 0
          ? 99
          : 0

    let riskLevel: "Healthy" | "Watch" | "Critical" | "Emergency" = "Healthy"

    if (projectedStaticFund <= 0 || projectedRunway <= 0) {
      riskLevel = "Emergency"
    } else if (projectedRunway < 1) {
      riskLevel = "Critical"
    } else if (projectedRunway < 3) {
      riskLevel = "Watch"
    }

    const actionPlan =
      riskLevel === "Healthy"
        ? [
            "Maintain current fund discipline and keep Dynamic Fund separate from company-owned money.",
            "Continue converting client payments into platform revenue without increasing fixed burn.",
            "Use surplus Static Fund for controlled growth, not uncontrolled hiring.",
          ]
        : riskLevel === "Watch"
          ? [
              "Reduce avoidable static expenses immediately.",
              "Prioritise faster client collections and campaign closure payments.",
              "Avoid using Dynamic Fund as company reserve because it belongs to campaign/client obligations.",
            ]
          : riskLevel === "Critical"
            ? [
                "Freeze all non-essential spending for the next finance cycle.",
                "Review every active campaign for pending receivables and delayed payouts.",
                "Increase platform fee collections or secure short-term operating inflow.",
              ]
            : [
                "Stop discretionary spending immediately.",
                "Do not touch Dynamic Fund unless it is directly campaign-linked.",
                "Prepare founder-level intervention: emergency revenue collection, cost cut, or capital support.",
              ]

    return {
      totalCredits,
      totalDebits,
      staticFund,
      dynamicFund,
      netCentralPosition,
      platformFees,
      netProfit,
      averageMonthlyCredits,
      averageMonthlyDebits,
      averageMonthlyPlatformRevenue,
      averageMonthlyBurn,
      runwayMonths,
      projectedStaticFund,
      projectedNetCentralPosition,
      projectedRunway,
      totalScenarioImpact,
      riskLevel,
      actionPlan,
      activeMonths,
    }
  }, [credits, debits, scenarioAmount, scenarioType, scenarioMonths])

  if (loading) {
    return (
      <AppShell>
        <PageSkeleton title="Building company projections..." />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-x-hidden bg-[#02030a] px-6 py-8 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Strategic Finance Intelligence
              </p>

              <h1 className="mt-4 text-4xl font-black">Company Projections</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Analyse current company status, project profit/loss scenarios, estimate fund impact, and calculate operating runway.
              </p>
            </div>

            <button
              onClick={fetchData}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Projection
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-8 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-amber-100">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Important Finance Assumption
            </p>
            <p className="mt-2 text-sm leading-6">
              Runway is calculated using Static Fund because Static Fund is company-owned money.
              Dynamic Fund is campaign/client-linked money and should not be treated as free operating reserve.
            </p>
          </div>

          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Static Fund" value={formatINR(projection.staticFund)} color="from-violet-400 to-fuchsia-500" />
            <Metric label="Dynamic Fund" value={formatINR(projection.dynamicFund)} color="from-cyan-400 to-sky-500" />
            <Metric label="Net Central Position" value={formatINR(projection.netCentralPosition)} color="from-emerald-400 to-teal-500" />
            <Metric label="Current Runway" value={`${formatMonths(projection.runwayMonths)} months`} color="from-amber-300 to-orange-400" />
          </div>

          <div className="mb-8 grid gap-6 xl:grid-cols-[1fr_420px]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Current Company Status
              </p>

              <h2 className="mt-3 text-2xl font-black">
                {projection.riskLevel === "Healthy"
                  ? "Company funds are currently stable."
                  : projection.riskLevel === "Watch"
                    ? "Company funds need active monitoring."
                    : projection.riskLevel === "Critical"
                      ? "Company runway is under pressure."
                      : "Company funds require immediate intervention."}
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <InfoRow label="Total Credits" value={formatINR(projection.totalCredits)} />
                <InfoRow label="Total Debits" value={formatINR(projection.totalDebits)} />
                <InfoRow label="Platform Fees Earned" value={formatINR(projection.platformFees)} />
                <InfoRow label="Net Profit Position" value={formatINR(projection.netProfit)} />
                <InfoRow label="Avg. Monthly Credits" value={formatINR(projection.averageMonthlyCredits)} />
                <InfoRow label="Avg. Monthly Debits" value={formatINR(projection.averageMonthlyDebits)} />
                <InfoRow label="Avg. Monthly Platform Revenue" value={formatINR(projection.averageMonthlyPlatformRevenue)} />
                <InfoRow label="Estimated Monthly Burn" value={formatINR(projection.averageMonthlyBurn)} />
              </div>
            </div>

            <div className={`rounded-3xl border p-6 shadow-2xl backdrop-blur ${riskCardClass(projection.riskLevel)}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">
                Projection Risk
              </p>
              <h2 className="mt-4 text-4xl font-black">{projection.riskLevel}</h2>
              <p className="mt-3 text-sm leading-6 opacity-80">
                Based on current Static Fund, estimated monthly burn, and selected profit/loss scenario.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm opacity-70">Projected Runway</p>
                <p className="mt-2 text-3xl font-black">
                  {formatMonths(projection.projectedRunway)} months
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
                  Custom Projection Simulator
                </p>
                <h2 className="mt-3 text-2xl font-black">Scenario Impact on Funds</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Test how profit or loss over a selected period affects Static Fund and runway.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[180px_1fr_180px]">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Scenario Type</label>
                <select
                  value={scenarioType}
                  onChange={(e) => setScenarioType(e.target.value as "profit" | "loss")}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                >
                  <option value="profit">Profit</option>
                  <option value="loss">Loss</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Monthly Amount</label>
                <input
                  type="number"
                  value={scenarioAmount}
                  onChange={(e) => setScenarioAmount(e.target.value)}
                  placeholder="Example: 50000"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Months</label>
                <input
                  type="number"
                  value={scenarioMonths}
                  onChange={(e) => setScenarioMonths(e.target.value)}
                  min="1"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <MiniProjection label="Total Scenario Impact" value={formatINR(projection.totalScenarioImpact)} />
              <MiniProjection label="Projected Static Fund" value={formatINR(projection.projectedStaticFund)} />
              <MiniProjection label="Projected Net Position" value={formatINR(projection.projectedNetCentralPosition)} />
              <MiniProjection label="Projected Runway" value={`${formatMonths(projection.projectedRunway)} months`} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Recommended Actions
            </p>
            <h2 className="mt-3 text-2xl font-black">What the company should do next</h2>

            <div className="mt-6 grid gap-4">
              {projection.actionPlan.map((action, index) => (
                <div
                  key={action}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-sm text-slate-400">Action {index + 1}</p>
                  <p className="mt-1 text-base font-semibold text-white">{action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 bg-gradient-to-r ${color} bg-clip-text text-3xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  )
}

function MiniProjection({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  )
}

function riskCardClass(risk: "Healthy" | "Watch" | "Critical" | "Emergency") {
  if (risk === "Healthy") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100 shadow-emerald-950/20"
  }

  if (risk === "Watch") {
    return "border-amber-400/20 bg-amber-500/10 text-amber-100 shadow-amber-950/20"
  }

  if (risk === "Critical") {
    return "border-orange-400/20 bg-orange-500/10 text-orange-100 shadow-orange-950/20"
  }

  return "border-red-400/20 bg-red-500/10 text-red-100 shadow-red-950/20"
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatMonths(value: number) {
  if (!Number.isFinite(value)) return "0"
  if (value >= 99) return "99+"
  return Math.max(value, 0).toFixed(1)
}
