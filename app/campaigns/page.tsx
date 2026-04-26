import { AppShell } from "@/components/app-shell"

export default function CampaignFinancePage() {
  return (
    <AppShell>
      <section className="p-8">
        <h1 className="text-3xl font-bold">Campaign Finance</h1>
        <p className="mt-2 text-slate-400">Campaign-wise client money, platform fees, payouts, and remaining balances.</p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="text-xl font-semibold">Campaign Allocation Table</h2>
          <p className="mt-2 text-sm text-slate-400">Next step: connect campaigns to Supabase and calculate remaining campaign balance.</p>
        </div>
      </section>
    </AppShell>
  )
}
