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
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading finance dashboard...
      </main>
    )
  }

  return (
    <AppShell>
      <header className="border-b border-slate-800 bg-slate-950 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-slate-400">{email} · {role}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900"
        >
          Logout
        </button>
      </header>

      <section className="p-8">
        <div className="mb-8 rounded-xl border border-amber-700 bg-amber-950/30 p-4 text-amber-300">
          Dynamic Fund represents client/campaign money and should not be treated as company-owned balance.
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card title="Static Fund" value="₹48.4L" color="text-violet-400" />
          <Card title="Dynamic Fund" value="₹9.4L" color="text-sky-400" />
          <Card title="Total Credits" value="₹50.5L" color="text-emerald-400" />
          <Card title="Total Debits" value="₹7.7L" color="text-rose-400" />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="text-xl font-semibold">Finance System Ready</h2>
          <p className="mt-2 text-slate-400">
            Sidebar navigation is now active. Next we can add real Supabase tables, CRUD forms, and reports.
          </p>
        </div>
      </section>
    </AppShell>
  )
}

function Card({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`mt-3 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}
