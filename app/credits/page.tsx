import { AppShell } from "@/components/app-shell"

export default function CreditsPage() {
  return (
    <AppShell>
      <section className="p-8">
        <h1 className="text-3xl font-bold">Credits</h1>
        <p className="mt-2 text-slate-400">Client payments and investments will be managed here.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-900/60 bg-slate-950 p-6">
            <h2 className="text-xl font-semibold text-emerald-400">Client Payments</h2>
            <p className="mt-2 text-sm text-slate-400">Track client money received, platform fee, and dynamic fund allocation.</p>
          </div>

          <div className="rounded-2xl border border-violet-900/60 bg-slate-950 p-6">
            <h2 className="text-xl font-semibold text-violet-400">Investments</h2>
            <p className="mt-2 text-sm text-slate-400">Track company investments that increase the Static Fund.</p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
