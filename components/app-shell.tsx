"use client"

import { Sidebar } from "@/components/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <Sidebar />
        <main className="min-h-screen flex-1 bg-black">
          {children}
        </main>
      </div>
    </div>
  )
}
