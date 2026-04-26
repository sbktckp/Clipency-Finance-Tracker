"use client"

import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#02030a] text-white">
      <div className="flex min-h-screen overflow-hidden">
        <div className="w-80 shrink-0">
          <Sidebar />
        </div>

        <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden bg-[#02030a]">
          {children}
        </main>
      </div>
    </div>
  )
}
