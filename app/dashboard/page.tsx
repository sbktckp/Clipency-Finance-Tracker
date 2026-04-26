"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/app-shell"

type Credit = {
  amount: number
  static_fund_amount: number
  dynamic_fund_amount: number
  platform_fee_amount: number
}

type Debit = {
  amount: number
  fund_type: "static" | "dynamic"
  debit_type: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadDashboard() {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        router.push("/login")
        return
      }

      const user = sessionData.session.user
      setEmail(user.email || "")

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", user.email)
        .single()

      if (!profile || (profile.role !== "senior_management" && profile.role !== "finance")) {
        router.push("/login")
        return
      }

      setRole(profile.role)

      const [creditsResult, debitsResult] = await Promise.all([
        supabase
          .from("finance_credits")
          .select("amount, static_fund_amount, dynamic_fund_amount, platform_fee_amount"),

        supabase
          .from("finance_debits")
          .select("amount, fund_type, debit_type"),
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

    loadDashboard()
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.push("/login")
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

    return {
      totalCredits,
      totalDebits,
      staticCredits,
      dynamicCredits,
      staticDebits,
      dynamicDebits,
      platformFees,
      staticFund,
      dynamicFund,
    }
  }, [credits, debits])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#02030a] text-white">
        <div className="rounded-2xl border border-violet-500/20 bg-white/[0.03] px-6 py-4 text-sm text-slate-300">
          Loading Clipency Finance OS...
        </div>
      </main>
    )
  }

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-hidden bg-[#02030a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(217,70,239,0.10),transparent_35%)]" />

        <header className="relative z-10 border-b border-violet-500/20 bg-[#050816]/80 px-8 py-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Live Internal Finance Control
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Financial Command Centre</h1>
              <p className="mt-1 text-sm text-slate-400">
                {email} · {role.replace("_", " ")}
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:border-violet-400/40 hover:bg-violet-500/20"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="relative z-10 px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-8 overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-violet-500/10 p-6 shadow-2xl shadow-amber-950/20">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                  Critical Fund Rule
                </p>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  Dynamic Fund is not company-owned money.
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                  Dashboard balances are now calculated live from Supabase. Static Fund equals
                  static credits minus static debits. Dynamic Fund equals dynamic credits minus
                  dynamic debits.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-amber-300/20 bg-black/20 px-5 py-4 text-right md:block">
                <p className="text-xs text-slate-400">Control Status</p>
                <p className="mt-1 text-lg font-bold text-emerald-300">Live</p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Static Fund"
              value={formatINR(totals.staticFund)}
              subtext={`${formatINR(totals.staticCredits)} credits - ${formatINR(totals.staticDebits)} debits`}
              color="from-violet-500 to-fuchsia-500"
            />
            <MetricCard
              label="Dynamic Fund"
              value={formatINR(totals.dynamicFund)}
              subtext={`${formatINR(totals.dynamicCredits)} credits - ${formatINR(totals.dynamicDebits)} debits`}
              color="from-cyan-400 to-sky-500"
            />
            <MetricCard
              label="Total Credits"
              value={formatINR(totals.totalCredits)}
              subtext="All incoming money recorded"
              color="from-emerald-400 to-teal-500"
            />
            <MetricCard
              label="Total Debits"
              value={formatINR(totals.totalDebits)}
              subtext="All outgoing money recorded"
              color="from-rose-400 to-pink-500"
            />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Central Fund Intelligence</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Live central balance derived from credits and debits.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Connected
                </span>
              </div>

              <div className="mt-8 space-y-5">
                <ProgressRow
                  label="Static Fund Remaining"
                  value={safePercent(totals.staticFund, totals.staticCredits)}
                />
                <ProgressRow
                  label="Dynamic Fund Remaining"
                  value={safePercent(totals.dynamicFund, totals.dynamicCredits)}
                />
                <ProgressRow
                  label="Debit Pressure"
                  value={safePercent(totals.totalDebits, totals.totalCredits)}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 to-cyan-500/10 p-6 shadow-2xl shadow-violet-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Current System
              </p>
              <h2 className="mt-4 text-2xl font-bold">Central Fund Connected</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Credits and debits are now feeding the dashboard. Next we’ll build the Funds page
                as a detailed breakdown of Static Fund and Dynamic Fund.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                Platform Fees: {formatINR(totals.platformFees)}
              </div>
            </div>
          </div>
                  </div>
        </section>
      </div>
    </AppShell>
  )
}

function MetricCard({
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
    <div className="group relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-violet-400/30">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-4 max-w-full truncate bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent 2xl:text-3xl`}>
        {value}
      </p>
      <p className="mt-3 line-clamp-2 text-xs text-slate-500">{subtext}</p>
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
