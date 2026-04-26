"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage("Password updated successfully. Redirecting to login...")

    setTimeout(() => {
      router.push("/login")
    }, 1600)

    setLoading(false)
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02030a] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_30%)]" />

      <div className="premium-card relative z-10 w-full max-w-xl rounded-3xl p-8">
        <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-violet-400/30 bg-white/[0.04] p-3 shadow-2xl shadow-violet-950/40">
          <img
            src="/clipency-logo.png"
            alt="Clipency"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="mt-8 text-center">
          <p className="kicker">Secure Password Reset</p>
          <h1 className="gradient-title mt-4 text-4xl font-black">
            Set New Password
          </h1>
          <p className="mt-3 text-slate-400">
            Create a new password for your Clipency Finance OS account.
          </p>
        </div>

        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              New Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="finance-input finance-control-height"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              Confirm New Password
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="finance-input finance-control-height"
              required
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {message}
            </div>
          )}

          <button
            disabled={loading}
            className="premium-button w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            Back to Login
          </button>
        </form>
      </div>
    </section>
  )
}
