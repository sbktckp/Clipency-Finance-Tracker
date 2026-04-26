"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"
import { PageSkeleton } from "@/components/loading-skeleton"

type AccessLog = {
  id: string
  full_name: string | null
  email: string
  role: string | null
  event_type: string
  created_at: string
}

type FinanceLog = {
  id: string
  user_email: string | null
  action: string
  entity_type: string
  entity_id: string | null
  amount: number | null
  description: string | null
  created_at: string
}

export default function LogsPage() {
  const router = useRouter()

  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [financeLogs, setFinanceLogs] = useState<FinanceLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [logTypeFilter, setLogTypeFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    checkAccessAndFetchLogs()
  }, [])

  async function checkAccessAndFetchLogs() {
    setLoading(true)
    setError("")

    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      router.push("/login")
      return
    }

    const user = sessionData.session.user

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", user.email)
      .single()

    if (profileError || !profile || profile.role !== "senior_management") {
      router.push("/access-restricted")
      return
    }

    await fetchLogs()
  }

  async function fetchLogs() {
    setError("")

    const [accessResult, financeResult] = await Promise.all([
      supabase
        .from("user_access_logs")
        .select("id, full_name, email, role, event_type, created_at")
        .order("created_at", { ascending: false }),

      supabase
        .from("finance_audit_logs")
        .select("id, user_email, action, entity_type, entity_id, amount, description, created_at")
        .order("created_at", { ascending: false }),
    ])

    if (accessResult.error) {
      setError(accessResult.error.message)
    } else {
      setAccessLogs(accessResult.data || [])
    }

    if (financeResult.error) {
      setError(financeResult.error.message)
    } else {
      setFinanceLogs(financeResult.data || [])
    }

    setLoading(false)
  }

  async function deleteAccessLog(id: string) {
    const ok = window.confirm("Delete this login log?")
    if (!ok) return

    const { error } = await supabase
      .from("user_access_logs")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchLogs()
  }

  async function deleteFinanceLog(id: string) {
    const ok = window.confirm("Delete this finance activity log?")
    if (!ok) return

    const { error } = await supabase
      .from("finance_audit_logs")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchLogs()
  }

  const filteredAccessLogs = useMemo(() => {
    return accessLogs.filter((log) => {
      const search = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !search ||
        (log.full_name || "").toLowerCase().includes(search) ||
        log.email.toLowerCase().includes(search) ||
        (log.role || "").toLowerCase().includes(search) ||
        log.event_type.toLowerCase().includes(search)

      const dateOnly = new Date(log.created_at).toISOString().slice(0, 10)
      const matchesStartDate = !startDate || dateOnly >= startDate
      const matchesEndDate = !endDate || dateOnly <= endDate

      return matchesSearch && matchesStartDate && matchesEndDate
    })
  }, [accessLogs, searchTerm, startDate, endDate])

  const filteredFinanceLogs = useMemo(() => {
    return financeLogs.filter((log) => {
      const search = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !search ||
        (log.user_email || "").toLowerCase().includes(search) ||
        log.action.toLowerCase().includes(search) ||
        log.entity_type.toLowerCase().includes(search) ||
        (log.description || "").toLowerCase().includes(search)

      const dateOnly = new Date(log.created_at).toISOString().slice(0, 10)
      const matchesStartDate = !startDate || dateOnly >= startDate
      const matchesEndDate = !endDate || dateOnly <= endDate

      return matchesSearch && matchesStartDate && matchesEndDate
    })
  }, [financeLogs, searchTerm, startDate, endDate])

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)

    return {
      loginEntries: filteredAccessLogs.length,
      financeEntries: filteredFinanceLogs.length,
      uniqueUsers: new Set([
        ...filteredAccessLogs.map((log) => log.email),
        ...filteredFinanceLogs.map((log) => log.user_email || ""),
      ]).size,
      todayLogins: filteredAccessLogs.filter((log) =>
        new Date(log.created_at).toISOString().slice(0, 10) === today
      ).length,
      todayFinance: filteredFinanceLogs.filter((log) =>
        new Date(log.created_at).toISOString().slice(0, 10) === today
      ).length,
    }
  }, [filteredAccessLogs, filteredFinanceLogs])

  return (
    <AppShell>
      <section className="mobile-page relative min-h-screen overflow-x-hidden bg-[#fff1f5] px-4 py-5 text-[#2b1422] sm:px-6 sm:py-8 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(216,180,254,0.18),transparent_30%)]" />

        <div className="mobile-container relative z-10 mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-[#2b1422]"
              >
                ← Back to Dashboard
              </Link>

              <p className="kicker">
                Access + Finance Intelligence
              </p>

              <h1 className="mt-4 gradient-title gradient-title text-3xl font-bold">System Logs</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Track user entries and every credit/debit activity performed inside Clipency Finance OS.
              </p>
            </div>

            <button
              onClick={fetchLogs}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-[#2b1422] hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Logs
            </button>
          </div>

          <div className="mb-8 overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="finance-filter-grid">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Search Logs</label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search email, name, role, action, description..."
                  className="finance-input finance-control-height"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Log Type</label>
                <select
                  value={logTypeFilter}
                  onChange={(e) => setLogTypeFilter(e.target.value)}
                  className="finance-input finance-control-height"
                >
                  <option value="all">All Logs</option>
                  <option value="finance">Finance Only</option>
                  <option value="login">Login Only</option>
                </select>
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
                    setLogTypeFilter("all")
                    setStartDate("")
                    setEndDate("")
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-[#2b1422]"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredAccessLogs.length} login logs and {filteredFinanceLogs.length} finance logs.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-8 text-slate-400">
              Loading logs...
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Login Entries" value={String(stats.loginEntries)} color="from-violet-500 to-fuchsia-500" />
                <Metric label="Finance Actions" value={String(stats.financeEntries)} color="from-cyan-400 to-sky-500" />
                <Metric label="Unique Users" value={String(stats.uniqueUsers)} color="from-emerald-400 to-teal-500" />
                <Metric label="Today Logins" value={String(stats.todayLogins)} color="from-amber-300 to-orange-400" />
                <Metric label="Today Finance" value={String(stats.todayFinance)} color="from-rose-400 to-pink-500" />
              </div>

              {logTypeFilter !== "login" && (
              <LogSection
                title="Finance Activity Ledger"
                subtitle="Every credit/debit create, edit, and delete action appears here."
              >
                {filteredFinanceLogs.length === 0 ? (
                  <Empty text="No finance activity recorded yet." />
                ) : (
                  <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">User</th>
                        <th className="px-5 py-3">Action</th>
                        <th className="px-5 py-3">Entity</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Description</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Time</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFinanceLogs.map((log) => {
                        const date = new Date(log.created_at)

                        return (
                          <tr key={log.id} className="border-t border-white/5 text-slate-300">
                            <td className="px-5 py-4">{log.user_email || "—"}</td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                                {log.action.replaceAll("_", " ")}
                              </span>
                            </td>
                            <td className="px-5 py-4 capitalize">{log.entity_type}</td>
                            <td className="px-5 py-4 font-semibold text-[#2b1422]">
                              {log.amount ? formatINR(log.amount) : "—"}
                            </td>
                            <td className="px-5 py-4">{log.description || "—"}</td>
                            <td className="px-5 py-4">{formatDate(date)}</td>
                            <td className="px-5 py-4">{formatTime(date)}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => deleteFinanceLog(log.id)}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </LogSection>

              )}

              {logTypeFilter === "all" && <div className="mt-8" />}

              {logTypeFilter !== "finance" && (
              <LogSection
                title="User Entry Ledger"
                subtitle="Successful login entries appear here."
              >
                {filteredAccessLogs.length === 0 ? (
                  <Empty text="No login entries recorded yet." />
                ) : (
                  <table className="w-full min-w-[950px] text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3">Event</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Time</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAccessLogs.map((log) => {
                        const date = new Date(log.created_at)

                        return (
                          <tr key={log.id} className="border-t border-white/5 text-slate-300">
                            <td className="px-5 py-4 font-semibold text-[#2b1422]">{log.full_name || "—"}</td>
                            <td className="px-5 py-4">{log.email}</td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                                {(log.role || "unknown").replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                                {log.event_type}
                              </span>
                            </td>
                            <td className="px-5 py-4">{formatDate(date)}</td>
                            <td className="px-5 py-4">{formatTime(date)}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => deleteAccessLog(log.id)}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </LogSection>
              )}
            </>
          )}
        </div>
      </section>
    </AppShell>
  )
}

function LogSection({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      <div className="scroll-safe mt-6 rounded-2xl border border-white/10">
        {children}
      </div>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="p-8 text-center text-slate-400">{text}</div>
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

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}
