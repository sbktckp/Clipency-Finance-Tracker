import { AppShell } from "@/components/app-shell"

export default function AdminPage() {
  return (
    <AppShell>
      <section className="p-8">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-2 text-slate-400">Senior management can manage users, roles, and access.</p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="text-xl font-semibold">Access Control</h2>
          <p className="mt-2 text-sm text-slate-400">Next step: connect profiles table and manage finance users.</p>
        </div>
      </section>
    </AppShell>
  )
}
