import { AppShell } from "@/components/app-shell"

export default function ReportsPage() {
  return (
    <AppShell>
      <section className="p-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="mt-2 text-slate-400">Financial summaries, exports, and analytics.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="font-semibold">Monthly Credit vs Debit</h2>
            <p className="mt-2 text-sm text-slate-400">Chart placeholder.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="font-semibold">Expense Breakdown</h2>
            <p className="mt-2 text-sm text-slate-400">Chart placeholder.</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h2 className="font-semibold">Fund Position</h2>
            <p className="mt-2 text-sm text-slate-400">Report placeholder.</p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
