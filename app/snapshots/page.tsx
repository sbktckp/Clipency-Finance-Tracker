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

type Snapshot = {
  id: string
  snapshot_month: string
  total_credits: number
  total_debits: number
  static_fund: number
  dynamic_fund: number
  platform_fees: number
  net_central_position: number
  created_by_email: string | null
  created_at: string
}

export default function MonthlySnapshotsPage() {
  const router = useRouter()

  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [role, setRole] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    checkAccessAndFetch()
  }, [])

  function getFinanceCycleRange(monthValue: string) {
    const [year, month] = monthValue.split("-").map(Number)

    const start = new Date(year, month - 1, 10)
    const end = new Date(year, month, 9)

    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }
  }

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

    setRole(profile.role)
    await fetchData()
  }

  async function fetchData() {
    setError("")

    const [creditsResult, debitsResult, snapshotsResult] = await Promise.all([
      supabase
        .from("finance_credits")
        .select("amount, static_fund_amount, dynamic_fund_amount, platform_fee_amount, payment_date"),

      supabase
        .from("finance_debits")
        .select("amount, fund_type, payment_date"),

      supabase
        .from("monthly_finance_snapshots")
        .select("*")
        .order("snapshot_month", { ascending: false }),
    ])

    if (creditsResult.error) setError(creditsResult.error.message)
    else setCredits(creditsResult.data || [])

    if (debitsResult.error) setError(debitsResult.error.message)
    else setDebits(debitsResult.data || [])

    if (snapshotsResult.error) setError(snapshotsResult.error.message)
    else setSnapshots(snapshotsResult.data || [])

    setLoading(false)
  }

  const currentCycleTotals = useMemo(() => {
    const { startDate, endDate } = getFinanceCycleRange(selectedMonth)

    const cycleCredits = credits.filter((item) => {
      const date = item.payment_date || ""
      return date >= startDate && date <= endDate
    })

    const cycleDebits = debits.filter((item) => {
      const date = item.payment_date || ""
      return date >= startDate && date <= endDate
    })

    const totalCredits = cycleCredits.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const totalDebits = cycleDebits.reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const staticCredits = cycleCredits.reduce(
      (sum, item) => sum + Number(item.static_fund_amount || 0),
      0
    )

    const dynamicCredits = cycleCredits.reduce(
      (sum, item) => sum + Number(item.dynamic_fund_amount || 0),
      0
    )

    const staticDebits = cycleDebits
      .filter((item) => item.fund_type === "static")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const dynamicDebits = cycleDebits
      .filter((item) => item.fund_type === "dynamic")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const platformFees = cycleCredits.reduce(
      (sum, item) => sum + Number(item.platform_fee_amount || 0),
      0
    )

    const staticFund = staticCredits - staticDebits
    const dynamicFund = dynamicCredits - dynamicDebits

    return {
      startDate,
      endDate,
      totalCredits,
      totalDebits,
      staticFund,
      dynamicFund,
      platformFees,
      netCentralPosition: staticFund + dynamicFund,
      creditEntries: cycleCredits.length,
      debitEntries: cycleDebits.length,
    }
  }, [credits, debits, selectedMonth])

  async function createSnapshot() {
    if (role !== "senior_management") {
      setError("Only senior management can create monthly snapshots.")
      return
    }

    const ok = window.confirm(
      `Create or update finance snapshot for ${selectedMonth}? This cycle is ${currentCycleTotals.startDate} to ${currentCycleTotals.endDate}.`
    )

    if (!ok) return

    setSaving(true)
    setError("")

    const { data: sessionData } = await supabase.auth.getSession()

    const { error } = await supabase
      .from("monthly_finance_snapshots")
      .upsert(
        {
          snapshot_month: selectedMonth,
          total_credits: currentCycleTotals.totalCredits,
          total_debits: currentCycleTotals.totalDebits,
          static_fund: currentCycleTotals.staticFund,
          dynamic_fund: currentCycleTotals.dynamicFund,
          platform_fees: currentCycleTotals.platformFees,
          net_central_position: currentCycleTotals.netCentralPosition,
          created_by: sessionData.session?.user.id,
          created_by_email: sessionData.session?.user.email,
        },
        { onConflict: "snapshot_month" }
      )

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    await fetchData()
    setSaving(false)
  }

  async function deleteSnapshot(id: string) {
    if (role !== "senior_management") return

    const ok = window.confirm("Delete this monthly snapshot?")
    if (!ok) return

    const { error } = await supabase
      .from("monthly_finance_snapshots")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchData()
  }

  if (loading) {
    return (
      <AppShell>
        <PageSkeleton title="Loading monthly finance snapshots..." />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="mobile-page relative min-h-screen overflow-x-hidden bg-[#02030a] px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="mobile-container relative z-10 mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker">
                Month-End Control
              </p>

              <h1 className="mt-4 gradient-title gradient-title text-4xl font-black">Monthly Finance Snapshots</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Freeze finance-cycle numbers into permanent records. Clipency’s finance month runs from the 10th of one month to the 9th of the next month.
              </p>
            </div>

            <button
              onClick={fetchData}
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

          <div className="mb-8 overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="grid gap-5 lg:grid-cols-[240px_1fr_auto] lg:items-end">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Finance Cycle Month</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="finance-input finance-control-height"
                />
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-sm leading-6 text-cyan-100">
                <span className="font-bold text-cyan-300">Active Cycle:</span>{" "}
                {currentCycleTotals.startDate} → {currentCycleTotals.endDate}
                <br />
                This includes all credits and debits recorded from the 10th through the 9th.
              </div>

              {role === "senior_management" && (
                <button
                  onClick={createSnapshot}
                  disabled={saving}
                  className="premium-button premium-button rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Create / Update Snapshot"}
                </button>
              )}
            </div>
          </div>

          <div className="mobile-grid mb-8">
            <Metric label="Cycle Credits" value={formatINR(currentCycleTotals.totalCredits)} color="from-emerald-400 to-teal-500" />
            <Metric label="Cycle Debits" value={formatINR(currentCycleTotals.totalDebits)} color="from-rose-400 to-pink-500" />
            <Metric label="Static Fund" value={formatINR(currentCycleTotals.staticFund)} color="from-violet-400 to-fuchsia-500" />
            <Metric label="Dynamic Fund" value={formatINR(currentCycleTotals.dynamicFund)} color="from-cyan-400 to-sky-500" />
          </div>

          <div className="mobile-grid mb-8">
            <InfoCard label="Platform Fees" value={formatINR(currentCycleTotals.platformFees)} />
            <InfoCard label="Net Central Position" value={formatINR(currentCycleTotals.netCentralPosition)} />
            <InfoCard label="Entries Count" value={`${currentCycleTotals.creditEntries} credits · ${currentCycleTotals.debitEntries} debits`} />
          </div>

          <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-2xl font-bold">Snapshot Ledger</h2>
            <p className="mt-1 text-sm text-slate-400">
              Saved finance-cycle records appear here.
            </p>

            <div className="scroll-safe mt-6 rounded-2xl border border-white/10">
              {snapshots.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No monthly snapshots saved yet.
                </div>
              ) : (
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Cycle Month</th>
                      <th className="px-5 py-3">Credits</th>
                      <th className="px-5 py-3">Debits</th>
                      <th className="px-5 py-3">Static Fund</th>
                      <th className="px-5 py-3">Dynamic Fund</th>
                      <th className="px-5 py-3">Platform Fees</th>
                      <th className="px-5 py-3">Net Position</th>
                      <th className="px-5 py-3">Created By</th>
                      <th className="px-5 py-3">Created At</th>
                      {role === "senior_management" && <th className="px-5 py-3">Action</th>}
                    </tr>
                  </thead>

                  <tbody>
                    {snapshots.map((snapshot) => (
                      <tr key={snapshot.id} className="border-t border-white/5 text-slate-300">
                        <td className="px-5 py-4 font-bold text-white">{snapshot.snapshot_month}</td>
                        <td className="px-5 py-4 text-emerald-300">{formatINR(snapshot.total_credits)}</td>
                        <td className="px-5 py-4 text-rose-300">{formatINR(snapshot.total_debits)}</td>
                        <td className="px-5 py-4 text-violet-300">{formatINR(snapshot.static_fund)}</td>
                        <td className="px-5 py-4 text-cyan-300">{formatINR(snapshot.dynamic_fund)}</td>
                        <td className="px-5 py-4 text-amber-300">{formatINR(snapshot.platform_fees)}</td>
                        <td className="px-5 py-4 font-bold text-white">{formatINR(snapshot.net_central_position)}</td>
                        <td className="px-5 py-4">{snapshot.created_by_email || "—"}</td>
                        <td className="px-5 py-4">{new Date(snapshot.created_at).toLocaleString("en-IN")}</td>
                        {role === "senior_management" && (
                          <td className="px-5 py-4">
                            <button
                              onClick={() => deleteSnapshot(snapshot.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 bg-gradient-to-r ${color} bg-clip-text text-3xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black text-white">{value}</p>
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
