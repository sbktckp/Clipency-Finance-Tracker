"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AppShell } from "@/components/app-shell"

export default function DashboardPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAccess() {
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
      setLoading(false)
    }

    checkAccess()
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

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

        <section className="relative z-10 p-8">
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
                  Client campaign balances must remain traceable, refundable when applicable,
                  and separated from Clipency’s Static Fund. Static Fund can be used fully in
                  emergencies; Dynamic Fund must remain campaign-aware.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-amber-300/20 bg-black/20 px-5 py-4 text-right md:block">
                <p className="text-xs text-slate-400">Control Status</p>
                <p className="mt-1 text-lg font-bold text-emerald-300">Protected</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Static Fund"
              value="₹48.4L"
              subtext="Company-owned reserve"
              color="from-violet-500 to-fuchsia-500"
            />
            <MetricCard
              label="Dynamic Fund"
              value="₹9.4L"
              subtext="Client/campaign money"
              color="from-cyan-400 to-sky-500"
            />
            <MetricCard
              label="Total Credits"
              value="₹50.5L"
              subtext="Clients + investments"
              color="from-emerald-400 to-teal-500"
            />
            <MetricCard
              label="Total Debits"
              value="₹7.7L"
              subtext="Payouts + expenses"
              color="from-rose-400 to-pink-500"
            />
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Fund Intelligence</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Static vs Dynamic fund separation overview.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  Healthy
                </span>
              </div>

              <div className="mt-8 space-y-5">
                <ProgressRow label="Static Fund Strength" value="84%" />
                <ProgressRow label="Dynamic Fund Exposure" value="32%" />
                <ProgressRow label="Debit Pressure" value="18%" />
              </div>
            </div>

            <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/15 to-cyan-500/10 p-6 shadow-2xl shadow-violet-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Next Build
              </p>
              <h2 className="mt-4 text-2xl font-bold">Finance Modules</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Next we will connect Credits, Debits, Funds, Campaign Finance, Reports,
                and Admin to live Supabase tables with CRUD operations.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                Current foundation: Auth, roles, sidebar, protected dashboard.
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
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-violet-400/30">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-4 bg-gradient-to-r ${color} bg-clip-text text-4xl font-black text-transparent`}>
        {value}
      </p>
      <p className="mt-3 text-xs text-slate-500">{subtext}</p>
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
