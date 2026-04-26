"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("clipency-sidebar-collapsed")

    if (saved === "true") {
      setCollapsed(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("clipency-sidebar-collapsed", String(collapsed))
  }, [collapsed])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#02030a] text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.10),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(217,70,239,0.07),transparent_30%)]" />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Mobile top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#050718]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3">
          <img src="/clipency-logo.png" alt="Clipency" className="h-9 w-9 rounded-xl" />
          <div>
            <p className="font-black leading-tight">Clipency</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">Finance OS</p>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white"
        >
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
            aria-label="Close mobile menu"
          />

          <div className="absolute left-0 top-0 h-full w-[300px] max-w-[85vw] border-r border-white/10 bg-[#050718] shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <img src="/clipency-logo.png" alt="Clipency" className="h-10 w-10 rounded-xl" />
                <div>
                  <p className="font-black">Clipency</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">Finance OS</p>
                </div>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
              >
                ✕
              </button>
            </div>

            <MobileNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main
        className={`relative z-10 min-h-screen transition-all duration-300 ease-out ${
          collapsed ? "lg:pl-[96px]" : "lg:pl-[300px]"
        }`}
      >
        {children}
      </main>
    </div>
  )
}

function MobileNav({ onNavigate }: { onNavigate: () => void }) {
  const items = [
    { name: "Overview", href: "/dashboard", icon: "◆" },
    { name: "Credits", href: "/credits", icon: "↑" },
    { name: "Debits", href: "/debits", icon: "↓" },
    { name: "Funds", href: "/funds", icon: "◇" },
    { name: "Campaign Finance", href: "/campaigns", icon: "◎" },
    { name: "Reports", href: "/reports", icon: "▣" },
    { name: "Tax", href: "/tax", icon: "●" },
    { name: "Projections", href: "/projections", icon: "◈" },
    { name: "Snapshots", href: "/snapshots", icon: "▥" },
    { name: "Logs", href: "/logs", icon: "◷" },
    { name: "Admin", href: "/admin", icon: "⚙" },
  ]

  return (
    <nav className="space-y-2 overflow-y-auto p-4">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-cyan-300">
            {item.icon}
          </span>
          {item.name}
        </a>
      ))}
    </nav>
  )
}
