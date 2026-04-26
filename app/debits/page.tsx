import { AppShell } from "@/components/app-shell"

const debitItems = [
  "Client Refunds / Paused Campaigns",
  "Clipper Payouts",
  "Employee Salaries",
  "Intern Payouts",
  "Subscriptions",
]

export default function DebitsPage() {
  return (
    <AppShell>
      <section className="p-8">
        <h1 className="text-3xl font-bold">Debits</h1>
        <p className="mt-2 text-slate-400">Manage outflows from Static and Dynamic Funds.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {debitItems.map((item) => (
            <div key={item} className="rounded-2xl border border-rose-900/50 bg-slate-950 p-6">
              <h2 className="text-lg font-semibold text-rose-300">{item}</h2>
              <p className="mt-2 text-sm text-slate-400">Debit tracking module coming next.</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
