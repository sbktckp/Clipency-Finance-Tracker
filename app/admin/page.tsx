"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

type Profile = {
  id: string
  full_name: string | null
  email: string
  role: string
  department: string | null
}

export default function AdminPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("employee")
  const [department, setDepartment] = useState("Employee")

  useEffect(() => {
    checkAdminAccess()
  }, [])

  async function checkAdminAccess() {
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      router.push("/login")
      return
    }

    const user = sessionData.session.user

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", user.email)
      .single()

    if (error || !profile || profile.role !== "senior_management") {
      router.push("/access-restricted")
      return
    }

    await fetchProfiles()
  }

  async function fetchProfiles() {
    setLoading(true)
    setError("")

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, department")
      .order("role", { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setProfiles(data || [])
    }

    setLoading(false)
  }

  async function upsertProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    if (!email.trim()) {
      setError("Email is required.")
      setSaving(false)
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle()

    const payload = {
      full_name: fullName.trim() || cleanEmail,
      email: cleanEmail,
      role,
      department: department.trim() || null,
    }

    let result

    if (existingProfile?.id) {
      result = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", existingProfile.id)
    } else {
      result = await supabase.from("profiles").insert(payload)
    }

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    setSuccess(existingProfile?.id ? "Profile updated successfully." : "Profile added successfully.")
    setFullName("")
    setEmail("")
    setRole("employee")
    setDepartment("Employee")
    await fetchProfiles()
    setSaving(false)
  }

  async function deleteProfile(id: string, profileEmail: string) {
    const confirmed = window.confirm(`Delete profile access for ${profileEmail}?`)
    if (!confirmed) return

    setError("")
    setSuccess("")

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess("Profile deleted successfully.")
    await fetchProfiles()
  }

  function editProfile(profile: Profile) {
    setFullName(profile.full_name || "")
    setEmail(profile.email)
    setRole(profile.role)
    setDepartment(profile.department || "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AppShell>
      <section className="mobile-page relative min-h-screen overflow-x-hidden bg-[#02030a] px-4 py-5 text-white sm:px-6 sm:py-8 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="mobile-container relative z-10 mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                ← Back to Dashboard
              </Link>

              <p className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
                Access Control
              </p>

              <h1 className="mt-4 gradient-title gradient-title text-3xl font-bold">Admin</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Manage who can access Clipency Finance OS. Users with senior_management or finance role can enter the system.
              </p>
            </div>

            <button
              onClick={fetchProfiles}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Users
            </button>
          </div>

          <div className="mb-8 rounded-3xl border border-amber-400/25 bg-amber-500/10 p-6 text-amber-200">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
              Access Rule
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Adding a profile here does not create a Supabase Auth user/password by itself. The user must still exist in Supabase Authentication or sign up/login separately. This page controls profile role validation.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
            <form
              onSubmit={upsertProfile}
              className="premium-card premium-hover rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur"
            >
              <h2 className="text-xl font-bold">Add / Update Access</h2>
              <p className="mt-1 text-sm text-slate-400">
                Use the same email the user logs in with.
              </p>

              <div className="mt-6 space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="User full name"
                />

                <Input
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="user@clipency.com"
                />

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="finance-input finance-control-height"
                  >
                    <option value="senior_management">Senior Management</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>

                <Input
                  label="Department"
                  value={department}
                  onChange={setDepartment}
                  placeholder="Finance / Senior Management"
                />

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full premium-button premium-button rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-bold shadow-lg shadow-violet-900/30 transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Access"}
                </button>
              </div>
            </form>

            <div className="min-w-0 premium-card premium-hover rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">User Access Ledger</h2>
              <p className="mt-1 text-sm text-slate-400">
                Current users inside the profiles table.
              </p>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                {loading ? (
                  <p className="p-6 text-slate-400">Loading profiles...</p>
                ) : profiles.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    No profiles found.
                  </div>
                ) : (
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3">Department</th>
                        <th className="px-5 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="border-t border-white/5 text-slate-300">
                          <td className="px-5 py-4 font-semibold text-white">
                            {profile.full_name || "—"}
                          </td>
                          <td className="px-5 py-4">{profile.email}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                profile.role === "senior_management"
                                  ? "bg-violet-500/10 text-violet-300"
                                  : "bg-slate-500/10 text-slate-300"
                              }`}
                            >
                              {profile.role.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-5 py-4">{profile.department || "—"}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editProfile(profile)}
                                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteProfile(profile.id, profile.email)}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="finance-input finance-control-height"
        placeholder={placeholder}
      />
    </div>
  )
}
