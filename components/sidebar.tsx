"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const baseNavItems = [
  { name: "Overview", href: "/dashboard", icon: "◆" },
  { name: "Credits", href: "/credits", icon: "↑" },
  { name: "Debits", href: "/debits", icon: "↓" },
  { name: "Funds", href: "/funds", icon: "◈" },
  { name: "Campaign Finance", href: "/campaigns", icon: "◎" },
  { name: "Reports", href: "/reports", icon: "▣" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function loadRole() {
      const { data: sessionData } = await supabase.auth.getSession()
      const email = sessionData.session?.user.email

      if (!email) return

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .single()

      setRole(data?.role || null)
    }

    loadRole()
  }, [])

  const navItems =
    role === "senior_management"
      ? [...baseNavItems, { name: "Admin", href: "/admin", icon: "⚙" }]
      : baseNavItems

  return (
    <aside className="relative min-h-screen w-80 overflow-hidden border-r border-violet-500/20 bg-[#050816]/95 px-5 py-6 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/30 bg-white/5 shadow-lg shadow-violet-900/30 backdrop-blur transition hover:scale-105 hover:border-cyan-300/40">
              <Image
                src="/clipency-logo.png"
                alt="Clipency Logo"
                width={38}
                height={38}
                className="rounded-xl object-contain"
                priority
              />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight">Clipency</h2>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                Finance OS
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-violet-500/20 bg-white/[0.03] p-4 backdrop-blur">
            <p className="text-xs text-slate-400">Internal Control System</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {role === "senior_management" ? "Senior Management Access" : "Employee Access"}
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/40"
                    : "text-slate-300 hover:bg-white/[0.06] hover:text-white hover:shadow-lg hover:shadow-violet-950/20"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs ${
                    active
                      ? "bg-white/20"
                      : "bg-white/[0.04] text-cyan-300 group-hover:bg-violet-500/20"
                  }`}
                >
                  {item.icon}
                </span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-10 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-200">
          <p className="font-semibold text-amber-300">Fund Discipline</p>
          <p className="mt-1">
            Dynamic Fund is client/campaign money. Static Fund is company-owned money.
          </p>
        </div>
      </div>
    </aside>
  )
}
