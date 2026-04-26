"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

type Debit = {
  id: string
  debit_type:
    | "client_refund"
    | "clipper_payout"
    | "employee_salary"
    | "intern_payout"
    | "subscription"
    | "other"
  recipient_name: string | null
  campaign_name: string | null
  amount: number
  fund_type: "static" | "dynamic"
  payment_date: string
  notes: string | null
  created_at: string
}

const debitTypes = [
  { value: "client_refund", label: "Client Refund / Paused Campaign" },
  { value: "clipper_payout", label: "Clipper Payout" },
  { value: "employee_salary", label: "Employee Salary" },
  { value: "intern_payout", label: "Intern Payout" },
  { value: "subscription", label: "Subscription" },
  { value: "other", label: "Other" },
] as const

export default function DebitsPage() {
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [fundFilter, setFundFilter] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [debitType, setDebitType] = useState<Debit["debit_type"]>("clipper_payout")
  const [recipientName, setRecipientName] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [amount, setAmount] = useState("")
  const [fundType, setFundType] = useState<"static" | "dynamic">("dynamic")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState("")
  const [editingDebitId, setEditingDebitId] = useState<string | null>(null)

  useEffect(() => {
    fetchDebits()
  }, [])

  async function fetchDebits() {
    setLoading(true)

    const { data, error } = await supabase
      .from("finance_debits")
      .select("*")
      .order("payment_date", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setDebits(data || [])
    }

    setLoading(false)
  }

  function startEditDebit(debit: Debit) {
    setEditingDebitId(debit.id)
    setDebitType(debit.debit_type)
    setRecipientName(debit.recipient_name || "")
    setCampaignName(debit.campaign_name || "")
    setAmount(String(Math.round(Number(debit.amount || 0))))
    setFundType(debit.fund_type)
    setPaymentDate(debit.payment_date)
    setNotes(debit.notes || "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetDebitForm() {
    setEditingDebitId(null)
    setDebitType("clipper_payout")
    setRecipientName("")
    setCampaignName("")
    setAmount("")
    setFundType("dynamic")
    setPaymentDate(new Date().toISOString().slice(0, 10))
    setNotes("")
  }

  async function deleteDebit(id: string) {
    const confirmed = window.confirm("Delete this debit entry?")
    if (!confirmed) return

    setError("")

    const { error } = await supabase
      .from("finance_debits")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    await fetchDebits()
  }

  async function addDebit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const numericAmount = parseAmount(amount)

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid debit amount.")
      setSaving(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()

    const payload = {
      debit_type: debitType,
      recipient_name: recipientName || null,
      campaign_name: campaignName || null,
      amount: numericAmount,
      fund_type: fundType,
      payment_date: paymentDate,
      notes,
      created_by: sessionData.session?.user.id,
    }

    const result = editingDebitId
      ? await supabase.from("finance_debits").update(payload).eq("id", editingDebitId)
      : await supabase.from("finance_debits").insert(payload)

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    resetDebitForm()
    await fetchDebits()
    setSaving(false)
  }

  const filteredDebits = useMemo(() => {
    return debits.filter((debit) => {
      const search = searchTerm.toLowerCase().trim()

      const matchesSearch =
        !search ||
        debit.debit_type.toLowerCase().includes(search) ||
        debit.fund_type.toLowerCase().includes(search) ||
        (debit.recipient_name || "").toLowerCase().includes(search) ||
        (debit.campaign_name || "").toLowerCase().includes(search) ||
        (debit.notes || "").toLowerCase().includes(search)

      const matchesFund = fundFilter === "all" || debit.fund_type === fundFilter

      const debitDate = debit.payment_date || ""
      const matchesStartDate = !startDate || debitDate >= startDate
      const matchesEndDate = !endDate || debitDate <= endDate

      return matchesSearch && matchesFund && matchesStartDate && matchesEndDate
    })
  }, [debits, searchTerm, fundFilter, startDate, endDate])

  const totals = useMemo(() => {
    return filteredDebits.reduce(
      (acc, item) => {
        acc.totalDebits += Number(item.amount || 0)

        if (item.fund_type === "static") {
          acc.staticDebits += Number(item.amount || 0)
        }

        if (item.fund_type === "dynamic") {
          acc.dynamicDebits += Number(item.amount || 0)
        }

        if (item.debit_type === "client_refund") {
          acc.refunds += Number(item.amount || 0)
        }

        return acc
      },
      {
        totalDebits: 0,
        staticDebits: 0,
        dynamicDebits: 0,
        refunds: 0,
      }
    )
  }, [filteredDebits])

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-x-hidden bg-[#02030a] px-6 py-8 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.12),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                ← Back to Dashboard
              </Link>

              <p className="inline-flex rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1 text-xs font-medium text-rose-300">
                Debit Control
              </p>

              <h1 className="mt-4 text-3xl font-bold">Debits</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Record refunds, clipper payouts, salaries, intern payouts, subscriptions, and other expenses.
                Every debit must be assigned to either Static Fund or Dynamic Fund.
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total Debits" value={formatINR(totals.totalDebits)} color="from-rose-400 to-pink-500" />
            <Metric label="Static Fund Debits" value={formatINR(totals.staticDebits)} color="from-violet-500 to-fuchsia-500" />
            <Metric label="Dynamic Fund Debits" value={formatINR(totals.dynamicDebits)} color="from-cyan-400 to-sky-500" />
            <Metric label="Client Refunds" value={formatINR(totals.refunds)} color="from-amber-300 to-orange-400" />
          </div>

          <div className="mb-8 rounded-3xl border border-amber-400/25 bg-amber-500/10 p-5 text-sm text-amber-200">
            <p className="font-semibold text-amber-300">Fund Rule</p>
            <p className="mt-1">
              Use <b>Dynamic Fund</b> for client/campaign-linked outflows like refunds and campaign payouts.
              Use <b> Static Fund</b> for company-owned expenses like salaries, subscriptions, and internal operations.
            </p>
          </div>

          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-[1fr_160px_170px_170px_auto]">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Search Debits</label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search recipient, campaign, type, notes..."
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Fund</label>
                <select
                  value={fundFilter}
                  onChange={(e) => setFundFilter(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                >
                  <option value="all">All</option>
                  <option value="static">Static</option>
                  <option value="dynamic">Dynamic</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("")
                    setFundFilter("all")
                    setStartDate("")
                    setEndDate("")
                  }}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredDebits.length} of {debits.length} debit entries.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
            <form onSubmit={addDebit} className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">{editingDebitId ? "Edit Debit" : "Add Debit"}</h2>
              <p className="mt-1 text-sm text-slate-400">
                {editingDebitId ? "Update the selected debit entry." : "Create a new debit entry."}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">Debit Type</label>
                  <select
                    value={debitType}
                    onChange={(e) => setDebitType(e.target.value as Debit["debit_type"])}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    {debitTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Recipient Name"
                  value={recipientName}
                  onChange={setRecipientName}
                  placeholder="Clipper / Employee / Vendor / Client"
                />

                <Input
                  label="Campaign Name"
                  value={campaignName}
                  onChange={setCampaignName}
                  placeholder="Optional campaign name"
                />

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Fund Type</label>
                  <select
                    value={fundType}
                    onChange={(e) => setFundType(e.target.value as "static" | "dynamic")}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                  >
                    <option value="dynamic">Dynamic Fund</option>
                    <option value="static">Static Fund</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Amount</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                    placeholder="5000"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-24 w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
                    placeholder="Optional notes"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-3 font-bold shadow-lg shadow-rose-900/30 transition hover:opacity-90 disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingDebitId ? "Update Debit" : "Add Debit"}
                </button>

                {editingDebitId && (
                  <button
                    type="button"
                    onClick={resetDebitForm}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-bold text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="text-xl font-bold">Debit Ledger</h2>
              <p className="mt-1 text-sm text-slate-400">Live debit entries from Supabase.</p>

              <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                {loading ? (
                  <p className="p-6 text-slate-400">Loading debits...</p>
                ) : filteredDebits.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    No debit entries match your current filters.
                  </div>
                ) : (
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Type</th>
                        <th className="px-5 py-3">Recipient</th>
                        <th className="px-5 py-3">Campaign</th>
                        <th className="px-5 py-3">Fund</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDebits.map((debit) => (
                        <tr key={debit.id} className="border-t border-white/5 text-slate-300">
                          <td className="px-5 py-4">
                            <span className="whitespace-nowrap rounded-full bg-white/5 px-3 py-1 text-xs">
                              {debit.debit_type.replaceAll("_", " ")}
                            </span>
                          </td>
                          <td className="px-5 py-4">{debit.recipient_name || "—"}</td>
                          <td className="px-5 py-4">{debit.campaign_name || "—"}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                debit.fund_type === "static"
                                  ? "bg-violet-500/10 text-violet-300"
                                  : "bg-cyan-500/10 text-cyan-300"
                              }`}
                            >
                              {debit.fund_type}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-rose-300">{formatINR(debit.amount)}</td>
                          <td className="px-5 py-4">{debit.payment_date}</td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditDebit(debit)}
                                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteDebit(debit.id)}
                                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-violet-400"
        placeholder={placeholder}
      />
    </div>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 break-words bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}

function parseAmount(value: string) {
  const cleaned = value.replace(/,/g, "").trim()
  const parsed = Number(cleaned)
  return Math.round(parsed)
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
