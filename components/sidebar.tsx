"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CurrencySwitch } from "@/components/currency-switch"

type SidebarProps = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
}

const navItems = [
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

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-white/10 bg-[#050718]/90 text-white shadow-2xl shadow-black/50 backdrop-blur-2xl transition-all duration-300 ease-out lg:block ${
        collapsed ? "w-[96px]" : "w-[300px]"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className={`flex items-center gap-4 px-5 py-6 ${collapsed ? "justify-center" : "justify-between"}`}>
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/30 bg-white/[0.04] shadow-lg shadow-violet-950/30">
              <img
                src="/clipency-logo.png"
                alt="Clipency"
                className="h-10 w-10 object-contain"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-xl font-black leading-tight">Clipency</h1>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                  Finance OS
                </p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              title="Collapse sidebar"
            >
              ←
            </button>
          )}
        </div>

        {collapsed && (
          <div className="px-5">
            <button
              onClick={() => setCollapsed(false)}
              className="mb-4 flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              title="Expand sidebar"
            >
              →
            </button>
          </div>
        )}

        {/* Access Card */}
        {!collapsed && (
          <div className="mx-5 mb-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-xs text-slate-400">Internal Control System</p>
            <p className="mt-2 text-sm font-bold text-white">Senior Management Access</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-4 sidebar-scroll">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`group flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg shadow-violet-950/40"
                    : "text-slate-300 hover:bg-white/[0.07] hover:text-white hover:translate-x-1"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base transition ${
                    active
                      ? "bg-white/15 text-white"
                      : "bg-white/[0.04] text-cyan-300 group-hover:bg-white/[0.08]"
                  }`}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="truncate">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer note */}
        {!collapsed && (
          <div className="m-5 space-y-4">
            <CurrencySwitch />

            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
              <p className="font-bold text-amber-300">Fund Discipline</p>
              <p className="mt-2">
                Dynamic Fund is client/campaign money. Static Fund is company-owned money.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.14);
          border-radius: 999px;
        }
      `}</style>
    </aside>
  )
}
