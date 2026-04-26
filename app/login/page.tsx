"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResetSent(false)

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setResetSent(true)
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("email", user.email)
      .single()

    if (profileError || !profile) {
      setError(profileError?.message || `No profile found for ${user.email}`)
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (profile.role !== "senior_management" && profile.role !== "employee") {
      setError("Access restricted. You do not have finance access.")
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    await supabase.from("user_access_logs").insert({
      user_id: user.id,
      full_name: profile.full_name || user.email,
      email: user.email || "",
      role: profile.role,
      event_type: "login",
    })

    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-violet-400/30 bg-white/[0.04] p-3 shadow-2xl shadow-violet-950/40">
            <img
              src="/clipency-logo.png"
              alt="Clipency"
              className="h-full w-full object-contain"
            />
          </div>

        <h1 className="text-center text-3xl font-bold">Clipency Finance</h1>
        <p className="mt-2 text-center text-slate-400">
          {forgotMode ? "Password Recovery — Secure Access" : "Internal Dashboard — Restricted Access"}
        </p>

        <div className="mt-8 rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-sm text-amber-300">
          This system is accessible to authorized Clipency team members only.
        </div>

        <form onSubmit={forgotMode ? handleForgotPassword : handleLogin} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clipency.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none focus:border-violet-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {resetSent && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                Password reset link sent. Check your email inbox.
              </div>
            )}

            {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/50 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet-600 py-3 font-semibold hover:bg-violet-500 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  )
}
