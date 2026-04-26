"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { supabase } from "@/lib/supabase"

type Credit = {
  id: string
  source_type: "client_payment" | "investment"
  client_name: string | null
  campaign_name: string | null
  amount: number
  platform_fee_amount: number
  dynamic_fund_amount: number
  static_fund_amount: number
  payment_date: string
}

type Debit = {
  id: string
  debit_type: string
  recipient_name: string | null
  campaign_name: string | null
  amount: number
  fund_type: "static" | "dynamic"
  payment_date: string
}

type CampaignRow = {
  campaign_name: string
  client_name: string
  client_payment: number
  platform_fee: number
  dynamic_allocation: number
  payouts: number
  refunds: number
  other_dynamic_debits: number
  remaining_balance: number
}

export default function CampaignFinancePage() {
  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCampaignData()
  }, [])

  async function fetchCampaignData() {
    setLoading(true)
    setError("")

    const [creditsResult, debitsResult] = await Promise.all([
      supabase
        .from("finance_credits")
        .select("id, source_type, client_name, campaign_name, amount, platform_fee_amount, dynamic_fund_amount, static_fund_amount, payment_date")
        .order("payment_date", { ascending: false }),

      supabase
        .from("finance_debits")
        .select("id, debit_type, recipient_name, campaign_name, amount, fund_type, payment_date")
        .order("payment_date", { ascending: false }),
    ])

    if (creditsResult.error) {
      setError(creditsResult.error.message)
    } else {
      setCredits(creditsResult.data || [])
    }

    if (debitsResult.error) {
      setError(debitsResult.error.message)
    } else {
      setDebits(debitsResult.data || [])
    }

    setLoading(false)
  }

  const campaigns = useMemo(() => {
    const map = new Map<string, CampaignRow>()

    function getCampaign(name: string, clientName = "—") {
      const key = name.trim() || "Unassigned Campaign"

      if (!map.has(key)) {
        map.set(key, {
          campaign_name: key,
          client_name: clientName || "—",
          client_payment: 0,
          platform_fee: 0,
          dynamic_allocation: 0,
          payouts: 0,
          refunds: 0,
          other_dynamic_debits: 0,
          remaining_balance: 0,
        })
      }

      return map.get(key)!
    }

    credits
      .filter((credit) => credit.source_type === "client_payment")
      .forEach((credit) => {
        const campaign = getCampaign(
          credit.campaign_name || "Unassigned Campaign",
          credit.client_name || "—"
        )

        if (campaign.client_name === "—" && credit.client_name) {
          campaign.client_name = credit.client_name
        }

        campaign.client_payment += Number(credit.amount || 0)
        campaign.platform_fee += Number(credit.platform_fee_amount || 0)
        campaign.dynamic_allocation += Number(credit.dynamic_fund_amount || 0)
      })

    debits
      .filter((debit) => debit.fund_type === "dynamic")
      .forEach((debit) => {
        const campaign = getCampaign(debit.campaign_name || "Unassigned Campaign")

        if (debit.debit_type === "client_refund") {
          campaign.refunds += Number(debit.amount || 0)
        } else if (debit.debit_type === "clipper_payout") {
          campaign.payouts += Number(debit.amount || 0)
        } else {
          campaign.other_dynamic_debits += Number(debit.amount || 0)
        }
      })

    return Array.from(map.values()).map((campaign) => ({
      ...campaign,
      remaining_balance:
        campaign.dynamic_allocation -
        campaign.payouts -
        campaign.refunds -
        campaign.other_dynamic_debits,
    }))
  }, [credits, debits])

  const totals = useMemo(() => {
    return campaigns.reduce(
      (acc, campaign) => {
        acc.clientPayment += campaign.client_payment
        acc.platformFee += campaign.platform_fee
        acc.dynamicAllocation += campaign.dynamic_allocation
        acc.payouts += campaign.payouts
        acc.refunds += campaign.refunds
        acc.remaining += campaign.remaining_balance
        return acc
      },
      {
        clientPayment: 0,
        platformFee: 0,
        dynamicAllocation: 0,
        payouts: 0,
        refunds: 0,
        remaining: 0,
      }
    )
  }, [campaigns])

  return (
    <AppShell>
      <section className="relative min-h-screen overflow-x-hidden bg-[#02030a] px-6 py-8 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
              >
                ← Back to Dashboard
              </Link>

              <p className="inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1 text-xs font-medium text-fuchsia-300">
                Campaign Finance Control
              </p>

              <h1 className="mt-4 text-3xl font-bold">Campaign Finance</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Campaign-wise client payment, platform fee, payouts, refunds, and remaining dynamic balance.
              </p>
            </div>

            <button
              onClick={fetchCampaignData}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-slate-400">
              Loading campaign finance data...
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Metric label="Client Payments" value={formatINR(totals.clientPayment)} color="from-emerald-400 to-teal-500" />
                <Metric label="Platform Fees" value={formatINR(totals.platformFee)} color="from-amber-300 to-orange-400" />
                <Metric label="Campaign Payouts" value={formatINR(totals.payouts)} color="from-rose-400 to-pink-500" />
                <Metric label="Remaining Dynamic" value={formatINR(totals.remaining)} color="from-cyan-400 to-sky-500" />
              </div>

              <div className="mb-8 rounded-3xl border border-amber-400/25 bg-amber-500/10 p-6 text-amber-200">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
                  Campaign Accounting Rule
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Campaign balance is calculated from Dynamic Fund only. Platform fee belongs to Static Fund.
                  Campaign payouts and client refunds reduce the campaign&apos;s Dynamic Fund balance.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Campaign Ledger</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Auto-generated from Credits and Debits entries.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href="/credits"
                      className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-400/20"
                    >
                      Add Client Payment
                    </Link>
                    <Link
                      href="/debits"
                      className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-400/20"
                    >
                      Add Payout / Refund
                    </Link>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                  {campaigns.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No campaign finance data yet. Add a client payment with campaign name first.
                    </div>
                  ) : (
                    <table className="w-full min-w-[1050px] text-left text-sm">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Campaign</th>
                          <th className="px-5 py-3">Client</th>
                          <th className="px-5 py-3">Client Payment</th>
                          <th className="px-5 py-3">Platform Fee</th>
                          <th className="px-5 py-3">Dynamic Allocation</th>
                          <th className="px-5 py-3">Payouts</th>
                          <th className="px-5 py-3">Refunds</th>
                          <th className="px-5 py-3">Other Dynamic Debits</th>
                          <th className="px-5 py-3">Remaining</th>
                          <th className="px-5 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map((campaign) => (
                          <tr key={campaign.campaign_name} className="border-t border-white/5 text-slate-300">
                            <td className="px-5 py-4 font-semibold text-white">{campaign.campaign_name}</td>
                            <td className="px-5 py-4">{campaign.client_name}</td>
                            <td className="px-5 py-4 text-emerald-300">{formatINR(campaign.client_payment)}</td>
                            <td className="px-5 py-4 text-amber-300">{formatINR(campaign.platform_fee)}</td>
                            <td className="px-5 py-4 text-cyan-300">{formatINR(campaign.dynamic_allocation)}</td>
                            <td className="px-5 py-4 text-rose-300">{formatINR(campaign.payouts)}</td>
                            <td className="px-5 py-4 text-orange-300">{formatINR(campaign.refunds)}</td>
                            <td className="px-5 py-4 text-slate-300">{formatINR(campaign.other_dynamic_debits)}</td>
                            <td className={`px-5 py-4 font-bold ${campaign.remaining_balance >= 0 ? "text-cyan-300" : "text-red-300"}`}>
                              {formatINR(campaign.remaining_balance)}
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs ${
                                  campaign.remaining_balance >= 0
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-red-500/10 text-red-300"
                                }`}
                              >
                                {campaign.remaining_balance >= 0 ? "Healthy" : "Overdrawn"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </AppShell>
  )
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 max-w-full truncate bg-gradient-to-r ${color} bg-clip-text text-2xl font-black text-transparent 2xl:text-3xl`}>
        {value}
      </p>
    </div>
  )
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
