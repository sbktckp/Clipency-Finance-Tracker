import { AppShell } from "@/components/app-shell"

export default function FundsPage() {
  return (
    <AppShell>
      <section className="p-8">
        <h1 className="text-3xl font-bold">Funds</h1>
        <p className="mt-2 text-slate-400">Separate company-owned money from client/campaign money.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-900/60 bg-slate-950 p-6">
            <p className="text-sm text-slate-400">Company-owned balance</p>
            <h2 className="mt-3 text-3xl font-bold text-violet-400">Static Fund</h2>
            <p className="mt-3 text-sm text-slate-400">Existing company fund + platform fees + investments - internal expenses.</p>
          </div>

          <div className="rounded-2xl border border-sky-900/60 bg-slate-950 p-6">
            <p className="text-sm text-slate-400">Client/campaign liability</p>
            <h2 className="mt-3 text-3xl font-bold text-sky-400">Dynamic Fund</h2>
            <p className="mt-3 text-sm text-slate-400">Client payment minus platform fee, refunds, campaign payouts, and campaign expenses.</p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
