"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { PageSkeleton } from "@/components/loading-skeleton"
import { supabase } from "@/lib/supabase"

type TaxRecord = {
  id: string
  tax_type: string
  title: string
  counterparty: string | null
  reference_number: string | null
  amount: number
  status: string
  due_date: string | null
  payment_date: string | null
  notes: string | null
  created_by_email: string | null
  created_at: string
}

const taxTypeLabels: Record<string, string> = {
  gst_payable: "GST Payable",
  gst_receivable: "GST Receivable",
  tds_deducted: "TDS Deducted",
  income_tax_provision: "Income Tax Provision",
  other: "Other Tax / Statutory Due",
}

export default function TaxPage() {
  const router = useRouter()

  const [records, setRecords] = useState<TaxRecord[]>([])
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [taxType, setTaxType] = useState("gst_payable")
  const [title, setTitle] = useState("")
  const [counterparty, setCounterparty] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("unpaid")
  const [dueDate, setDueDate] = useState("")
  const [paymentDate, setPaymentDate] = useState("")
  const [notes, setNotes] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    checkAccessAndFetch()
  }, [])

  async function checkAccessAndFetch() {
    setLoading(true)
    setError("")

    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      router.push("/login")
      return
    }

    const email = sessionData.session.user.email

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single()

    if (profileError || !profile || !["senior_management", "employee"].includes(profile.role)) {
      router.push("/access-restricted")
      return
    }

    setRole(profile.role)
    await fetchRecords()
  }

  async function fetchRecords() {
    setError("")

    const { data, error } = await supabase
      .from("tax_records")
      .select("*")
      .order("due_date", { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setRecords(data || [])
    }

    setLoading(false)
  }

  function resetForm() {
    setEditingId(null)
    setTaxType("gst_payable")
    setTitle("")
    setCounterparty("")
    setReferenceNumber("")
    setAmount("")
    setStatus("unpaid")
    setDueDate("")
    setPaymentDate("")
    setNotes("")
  }

  function startEdit(record: TaxRecord) {
    setEditingId(record.id)
    setTaxType(record.tax_type)
    setTitle(record.title)
    setCounterparty(record.counterparty || "")
    setReferenceNumber(record.reference_number || "")
    setAmount(String(Math.round(Number(record.amount || 0))))
    setStatus(record.status)
    setDueDate(record.due_date || "")
    setPaymentDate(record.payment_date || "")
    setNotes(record.notes || "")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function saveTaxRecord(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const numericAmount = Number(amount || 0)

    if (!title.trim()) {
      setError("Tax title is required.")
      setSaving(false)
      return
    }

    if (numericAmount <= 0) {
      setError("Amount must be greater than zero.")
      setSaving(false)
      return
    }

    if (!dueDate) {
      setError("Due date is required.")
      setSaving(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()

    const payload = {
      tax_type: taxType,
      title: title.trim(),
      counterparty: counterparty || null,
      reference_number: referenceNumber || null,
      amount: numericAmount,
      status,
      due_date: dueDate || null,
      payment_date: paymentDate || null,
      notes: notes || null,
      created_by: sessionData.session?.user.id,
      created_by_email: sessionData.session?.user.email,
    }

    const result = editingId
      ? await supabase.from("tax_records").update(payload).eq("id", editingId)
      : await supabase.from("tax_records").insert(payload)

    if (result.error) {
      setError(result.error.message)
      setSaving(false)
      return
    }

    await supabase.from("finance_audit_logs").insert({
      user_id: sessionData.session?.user.id,
      user_email: sessionData.session?.user.email,
      action: editingId ? "tax_record_updated" : "tax_record_created",
      entity_type: "tax",
      entity_id: editingId,
      amount: numericAmount,
      description: `${editingId ? "Updated" : "Created"} tax record: ${title}`,
    })

    resetForm()
    await fetchRecords()
    setSaving(false)
  }

  async function deleteRecord(id: string) {
    if (role !== "senior_management") return

    const ok = window.confirm(
      "This will permanently delete this tax record. This action cannot be undone."
    )

    if (!ok) return

    const { error } = await supabase
      .from("tax_records")
      .delete()
      .eq("id", id)

    if (error) {
      setError(error.message)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()

    await supabase.from("finance_audit_logs").insert({
      user_id: sessionData.session?.user.id,
      user_email: sessionData.session?.user.email,
      action: "tax_record_deleted",
      entity_type: "tax",
      entity_id: id,
      description: "Deleted tax record",
    })

    await fetchRecords()
  }

  const filteredRecords = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()

    return records.filter((record) => {
      const matchesSearch =
        !search ||
        record.title.toLowerCase().includes(search) ||
        (record.counterparty || "").toLowerCase().includes(search) ||
        (record.reference_number || "").toLowerCase().includes(search) ||
        (record.notes || "").toLowerCase().includes(search)

      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      const matchesType = typeFilter === "all" || record.tax_type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [records, searchTerm, statusFilter, typeFilter])

  const totals = useMemo(() => {
    const gstPayable = filteredRecords
      .filter((item) => item.tax_type === "gst_payable")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const gstReceivable = filteredRecords
      .filter((item) => item.tax_type === "gst_receivable")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const tdsDeducted = filteredRecords
      .filter((item) => item.tax_type === "tds_deducted")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const incomeTaxProvision = filteredRecords
      .filter((item) => item.tax_type === "income_tax_provision")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const unpaidLiability = filteredRecords
      .filter((item) => item.status !== "paid" && item.tax_type !== "gst_receivable")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0)

    const netGstPosition = gstPayable - gstReceivable

    const overdue = filteredRecords.filter((item) => {
      if (item.status === "paid" || !item.due_date) return false
      return item.due_date < new Date().toISOString().slice(0, 10)
    }).length

    return {
      gstPayable,
      gstReceivable,
      netGstPosition,
      tdsDeducted,
      incomeTaxProvision,
      unpaidLiability,
      overdue,
    }
  }, [filteredRecords])

  if (loading) {
    return (
      <AppShell>
        <PageSkeleton title="Loading tax control..." />
      </AppShell>
    )
  }

  return (
    <AppShell>
      <section className="mobile-page relative min-h-screen overflow-x-hidden bg-[#fff1f5] px-4 py-5 text-[#2b1422] sm:px-6 sm:py-8 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(216,180,254,0.18),transparent_30%)]" />

        <div className="mobile-container relative z-10 mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="kicker">
                Compliance Control
              </p>

              <h1 className="mt-4 gradient-title gradient-title text-4xl font-black">Tax Control</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Track GST, TDS, income tax provisions, statutory dues, due dates, payment status, and compliance exposure.
              </p>
            </div>

            <button
              onClick={fetchRecords}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-[#2b1422] transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Tax Data
            </button>
          </div>

          <div className="mb-8 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-amber-100">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Compliance Note
            </p>
            <p className="mt-2 text-sm leading-6">
              This page is an internal tax tracker, not legal or accounting advice. Final filings, GST treatment, TDS treatment, and tax payments should be verified by a qualified CA/accountant.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mobile-grid mb-8">
            <Metric label="GST Payable" value={formatINR(totals.gstPayable)} color="from-rose-400 to-pink-500" />
            <Metric label="GST Receivable" value={formatINR(totals.gstReceivable)} color="from-cyan-400 to-sky-500" />
            <Metric label="Net GST Position" value={formatINR(totals.netGstPosition)} color={totals.netGstPosition >= 0 ? "from-amber-300 to-orange-400" : "from-emerald-400 to-teal-500"} />
            <Metric label="Unpaid Liability" value={formatINR(totals.unpaidLiability)} color="from-violet-400 to-fuchsia-500" />
          </div>

          <div className="mobile-grid mb-8">
            <InfoCard label="TDS Deducted" value={formatINR(totals.tdsDeducted)} />
            <InfoCard label="Income Tax Provision" value={formatINR(totals.incomeTaxProvision)} />
            <InfoCard label="Overdue Records" value={String(totals.overdue)} />
          </div>

          <div className="mb-8 grid min-w-0 gap-6 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)]">
            <form
              onSubmit={saveTaxRecord}
              className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur"
            >
              <h2 className="text-2xl font-bold">{editingId ? "Edit Tax Record" : "Add Tax Record"}</h2>
              <p className="mt-1 text-sm text-slate-400">
                Record statutory dues, receivables, provisions, and payment status.
              </p>

              <div className="mt-6 space-y-5">
                <Field label="Tax Type">
                  <select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="finance-input finance-control-height"
                  >
                    <option value="gst_payable">GST Payable</option>
                    <option value="gst_receivable">GST Receivable</option>
                    <option value="tds_deducted">TDS Deducted</option>
                    <option value="income_tax_provision">Income Tax Provision</option>
                    <option value="other">Other Tax / Statutory Due</option>
                  </select>
                </Field>

                <Field label="Title">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Example: April GST liability"
                    className="finance-input finance-control-height"
                  />
                </Field>

                <Field label="Counterparty">
                  <input
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    placeholder="Client / Vendor / Department"
                    className="finance-input finance-control-height"
                  />
                </Field>

                <Field label="Reference Number">
                  <input
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Invoice / challan / filing reference"
                    className="finance-input finance-control-height"
                  />
                </Field>

                <Field label="Amount">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                    className="finance-input finance-control-height"
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="finance-input finance-control-height"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Paid</option>
                  </select>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Due Date">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="finance-input finance-control-height"
                    />
                  </Field>

                  <Field label="Payment Date">
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="finance-input finance-control-height"
                    />
                  </Field>
                </div>

                <Field label="Notes">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal remarks, filing status, CA comments..."
                    className="input min-h-28 resize-none"
                  />
                </Field>

                <button
                  disabled={saving}
                  className="w-full premium-button premium-button rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-bold text-[#2b1422] shadow-lg shadow-violet-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Tax Record" : "Add Tax Record"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-bold text-slate-300 hover:bg-white/[0.08] hover:text-[#2b1422]"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-6">
              <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="finance-filter-grid overflow-safe">
                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Search Tax Records</label>
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search tax records..."
                      className="finance-input finance-control-height"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="finance-input finance-control-height"
                    >
                      <option value="all">All Types</option>
                      <option value="gst_payable">GST Payable</option>
                      <option value="gst_receivable">GST Receivable</option>
                      <option value="tds_deducted">TDS Deducted</option>
                      <option value="income_tax_provision">Income Tax Provision</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-300">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="finance-input finance-control-height"
                    >
                      <option value="all">All Status</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="partially_paid">Partially Paid</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("")
                        setTypeFilter("all")
                        setStatusFilter("all")
                      }}
                      className="h-[52px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-[#2b1422]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500">
                  Showing {filteredRecords.length} of {records.length} tax records.
                </p>
              </div>

              <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <h2 className="text-2xl font-bold">Tax Ledger</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Latest compliance records and statutory dues.
                </p>

                <div className="scroll-safe mt-6 rounded-2xl border border-white/10">
                  {filteredRecords.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No tax records found.
                    </div>
                  ) : (
                    <table className="w-full min-w-[1100px] text-left text-sm">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Type</th>
                          <th className="px-5 py-3">Title</th>
                          <th className="px-5 py-3">Counterparty</th>
                          <th className="px-5 py-3">Amount</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3">Due Date</th>
                          <th className="px-5 py-3">Reference</th>
                          <th className="px-5 py-3">Created By</th>
                          <th className="px-5 py-3">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredRecords.map((record) => (
                          <tr key={record.id} className="border-t border-white/5 text-slate-300">
                            <td className="px-5 py-4">
                              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                                {taxTypeLabels[record.tax_type] || record.tax_type}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-bold text-[#2b1422]">{record.title}</td>
                            <td className="px-5 py-4">{record.counterparty || "—"}</td>
                            <td className="px-5 py-4 font-bold text-[#2b1422]">{formatINR(record.amount)}</td>
                            <td className="px-5 py-4">
                              <StatusBadge status={record.status} />
                            </td>
                            <td className={`px-5 py-4 ${isOverdue(record) ? "font-bold text-red-300" : ""}`}>
                              {record.due_date || "—"}
                            </td>
                            <td className="px-5 py-4">{record.reference_number || "—"}</td>
                            <td className="px-5 py-4">{record.created_by_email || "—"}</td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(record)}
                                  className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300 hover:bg-cyan-500/20"
                                >
                                  Edit
                                </button>

                                {role === "senior_management" && (
                                  <button
                                    onClick={() => deleteRecord(record.id)}
                                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300 hover:bg-red-500/20"
                                  >
                                    Delete
                                  </button>
                                )}
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
        </div>


      </section>
    </AppShell>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 bg-gradient-to-r ${color} bg-clip-text text-3xl font-black text-transparent`}>
        {value}
      </p>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black text-[#2b1422]">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "paid"
      ? "bg-emerald-500/10 text-emerald-300"
      : status === "partially_paid"
        ? "bg-amber-500/10 text-amber-300"
        : "bg-red-500/10 text-red-300"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {status.replace("_", " ")}
    </span>
  )
}

function isOverdue(record: TaxRecord) {
  if (record.status === "paid" || !record.due_date) return false
  return record.due_date < new Date().toISOString().slice(0, 10)
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
