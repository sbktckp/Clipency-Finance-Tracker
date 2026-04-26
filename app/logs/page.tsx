"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

type AccessLog = {
  id: string
  user_id: string | null
  full_name: string | null
  email: string
  role: string | null
  event_type: string
  created_at: string
}

export default function LogsPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
    const { data, error } = await supabase
      .from("user_access_logs")
      .select("id, user_id, full_name, email, role, event_type, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setLogs(data || [])
    }

    setLoading(false)
  }

  const stats = useMemo(() => {
    const uniqueUsers = new Set(logs.map((log) => log.email)).size
    const today = new Date().toISOString().slice(0, 10)

    const todayEntries = logs.filter((log) =>
      new Date(log.created_at).toISOString().slice(0, 10) === today
    ).length

    const seniorEntries = logs.filter((log) => log.role === "senior_management").length
    const employeeEntries = logs.filter((log) => log.role === "employee").length

    return {
      totalEntries: logs.length,
      uniqueUsers,
      todayEntries,
      seniorEntries,
      employeeEntries,
    }
  }, [logs])

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

              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                Access Intelligence
              </p>

              <h1 className="mt-4 text-3xl font-bold">User Entry Logs</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Every successful user login is recorded here with name, email, role, date, and timestamp.
              </p>
            </div>

            <button
              onClick={fetchLogs}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Logs
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-slate-400">
              Loading access logs...
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
                <Metric label="Total Entries" value={String(stats.totalEntries)} color="from-violet-500 to-fuchsia-500" />
                <Metric label="Unique Users" value={String(stats.uniqueUsers)} color="from-cyan-400 to-sky-500" />
                <Metric label="Today" value={String(stats.todayEntries)} color="from-emerald-400 to-teal-500" />
                <Metric label="Senior Entries" value={String(stats.seniorEntries)} color="from-amber-300 to-orange-400" />
                <Metric label="Employee Entries" value={String(stats.employeeEntries)} color="from-rose-400 to-pink-500" />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <h2 className="text-xl font-bold">Entry Ledger</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Latest login entries appear first.
                </p>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                  {logs.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No login entries recorded yet.
                    </div>
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
                          <th className="px-5 py-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => {
                          const date = new Date(log.created_at)

                          return (
                            <tr key={log.id} className="border-t border-white/5 text-slate-300">
                              <td className="px-5 py-4 font-semibold text-white">
                                {log.full_name || "—"}
                              </td>
                              <td className="px-5 py-4">{log.email}</td>
                              <td className="px-5 py-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs ${
                                    log.role === "senior_management"
                                      ? "bg-violet-500/10 text-violet-300"
                                      : "bg-slate-500/10 text-slate-300"
                                  }`}
                                >
                                  {(log.role || "unknown").replace("_", " ")}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                                  {log.event_type}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {date.toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-5 py-4">
                                {date.toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </td>
                              <td className="px-5 py-4 text-slate-500">
                                {date.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          )
                        })}
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
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 bg-gradient-to-r ${color} bg-clip-text text-3xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}
