"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Credits", href: "/credits" },
  { name: "Debits", href: "/debits" },
  { name: "Funds", href: "/funds" },
  { name: "Campaign Finance", href: "/campaigns" },
  { name: "Reports", href: "/reports" },
  { name: "Admin", href: "/admin" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="min-h-screen w-72 border-r border-slate-800 bg-slate-950 px-5 py-6 text-white">
      <div className="mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-xl font-bold">
          C
        </div>
        <h2 className="mt-4 text-xl font-bold">Clipency Finance</h2>
        <p className="text-sm text-slate-400">Internal Control System</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-10 rounded-xl border border-amber-700 bg-amber-950/30 p-4 text-xs text-amber-300">
        Dynamic Fund is client/campaign money, not company-owned money.
      </div>
    </aside>
  )
}
