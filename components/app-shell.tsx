"use client"

import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="clipency-premium-ui min-h-screen bg-[#02030a] text-white">
      <div className="clipency-ambient-glow" />
      <div className="clipency-grid-texture pointer-events-none fixed inset-0 z-0" />

      <div className="relative z-10 flex min-h-screen overflow-hidden">
        <div className="w-80 shrink-0">
          <Sidebar />
        </div>

        <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden bg-transparent">
          <div className="clipency-page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
