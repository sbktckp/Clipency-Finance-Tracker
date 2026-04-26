"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { PageSkeleton } from "@/components/loading-skeleton"
import { supabase } from "@/lib/supabase"

type Credit = {
  id: string
  source_type: string
  client_name: string | null
  campaign_name: string | null
  amount: number
  platform_fee_amount: number
  static_fund_amount: number
  dynamic_fund_amount: number
  payment_date: string
}

type Debit = {
  id: string
  debit_type: string
  recipient_name: string | null
  campaign_name: string | null
  fund_type: string
  amount: number
  payment_date: string
}

type CampaignPL = {
  campaign: string
  client: string
  clientPayments: number
  platformRevenue: number
  campaignPool: number
  dynamicOutflows: number
  staticExpenses: number
  remainingBalance: number
  netPL: number
  status: "Healthy" | "Watch" | "Loss" | "Unassigned"
}

export default function CampaignFinancePage() {
  const router = useRouter()

  const [credits, setCredits] = useState<Credit[]>([])
  const [debits, setDebits] = useState<Debit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

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

    await fetchCampaignData()
  }

  async function fetchCampaignData() {
    setError("")

    const [creditsResult, debitsResult] = await Promise.all([
      supabase
        .from("finance_credits")
        .select("id, source_type, client_name, campaign_name, amount, platform_fee_amount, static_fund_amount, dynamic_fund_amount, payment_date")
        .order("payment_date", { ascending: false }),

      supabase
        .from("finance_debits")
        .select("id, debit_type, recipient_name, campaign_name, fund_type, amount, payment_date")
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

  const campaignPL = useMemo(() => {
    const map = new Map<string, CampaignPL>()

    function getCampaign(name: string | null) {
      const campaign = name?.trim() || "Unassigned Campaign"

      if (!map.has(campaign)) {
        map.set(campaign, {
          campaign,
          client: "—",
          clientPayments: 0,
          platformRevenue: 0,
          campaignPool: 0,
          dynamicOutflows: 0,
          staticExpenses: 0,
          remainingBalance: 0,
          netPL: 0,
          status: campaign === "Unassigned Campaign" ? "Unassigned" : "Healthy",
        })
      }

      return map.get(campaign)!
    }

    credits.forEach((credit) => {
      const item = getCampaign(credit.campaign_name)

      if (credit.client_name) {
        item.client = credit.client_name
      }

      if (credit.source_type === "client_payment") {
        item.clientPayments += Number(credit.amount || 0)
      }

      item.platformRevenue += Number(credit.platform_fee_amount || 0)
      item.campaignPool += Number(credit.dynamic_fund_amount || 0)
    })

    debits.forEach((debit) => {
      const item = getCampaign(debit.campaign_name)

      if (debit.fund_type === "dynamic") {
        item.dynamicOutflows += Number(debit.amount || 0)
      }

      if (debit.fund_type === "static") {
        item.staticExpenses += Number(debit.amount || 0)
      }
    })

    return Array.from(map.values())
      .map((item) => {
        const remainingBalance = item.campaignPool - item.dynamicOutflows
        const netPL = item.platformRevenue - item.staticExpenses

        let status: CampaignPL["status"] = "Healthy"

        if (item.campaign === "Unassigned Campaign") {
          status = "Unassigned"
        } else if (netPL < 0) {
          status = "Loss"
        } else if (remainingBalance < 0) {
          status = "Watch"
        }

        return {
          ...item,
          remainingBalance,
          netPL,
          status,
        }
      })
      .sort((a, b) => b.clientPayments - a.clientPayments)
  }, [credits, debits])

  const filteredCampaigns = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()

    return campaignPL.filter((item) => {
      return (
        !search ||
        item.campaign.toLowerCase().includes(search) ||
        item.client.toLowerCase().includes(search) ||
        item.status.toLowerCase().includes(search)
      )
    })
  }, [campaignPL, searchTerm])

  const totals = useMemo(() => {
    return filteredCampaigns.reduce(
      (acc, item) => {
        acc.clientPayments += item.clientPayments
        acc.platformRevenue += item.platformRevenue
        acc.campaignPool += item.campaignPool
        acc.dynamicOutflows += item.dynamicOutflows
        acc.staticExpenses += item.staticExpenses
        acc.remainingBalance += item.remainingBalance
        acc.netPL += item.netPL
        return acc
      },
      {
        clientPayments: 0,
        platformRevenue: 0,
        campaignPool: 0,
        dynamicOutflows: 0,
        staticExpenses: 0,
        remainingBalance: 0,
        netPL: 0,
      }
    )
  }, [filteredCampaigns])

  if (loading) {
    return (
      <AppShell>
        <PageSkeleton title="Loading campaign profit and loss..." />
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
                Campaign Intelligence
              </p>

              <h1 className="mt-4 gradient-title gradient-title text-4xl font-black">Campaign Profit & Loss</h1>
              <p className="mt-2 max-w-4xl text-slate-400">
                Track campaign-wise client payments, platform revenue, outflows, remaining campaign balance, and net P&L.
              </p>
            </div>

            <button
              onClick={fetchCampaignData}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-[#2b1422] transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
            >
              Refresh Data
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mobile-grid mb-8">
            <Metric label="Client Payments" value={formatINR(totals.clientPayments)} color="from-emerald-400 to-teal-500" />
            <Metric label="Platform Revenue" value={formatINR(totals.platformRevenue)} color="from-amber-300 to-orange-400" />
            <Metric label="Campaign Pool" value={formatINR(totals.campaignPool)} color="from-cyan-400 to-sky-500" />
            <Metric label="Net P&L" value={formatINR(totals.netPL)} color={totals.netPL >= 0 ? "from-violet-400 to-fuchsia-500" : "from-rose-400 to-red-500"} />
          </div>

          <div className="mb-8 overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="finance-filter-grid">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Search Campaigns</label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search campaign, client, status..."
                  className="finance-input finance-control-height"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-[#2b1422]"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredCampaigns.length} of {campaignPL.length} campaigns.
            </p>
          </div>

          <div className="overflow-safe overflow-safe premium-card premium-hover overflow-safe rounded-3xl p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Campaign P&L Ledger</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Net P&L = Platform Revenue - Static Campaign Expenses. Campaign Balance = Campaign Pool - Dynamic Outflows.
                </p>
              </div>
            </div>

            <div className="scroll-safe mt-6 rounded-2xl border border-white/10">
              {filteredCampaigns.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No campaign records found.
                </div>
              ) : (
                <table className="w-full min-w-[1150px] text-left text-sm">
                  <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Campaign</th>
                      <th className="px-5 py-3">Client</th>
                      <th className="px-5 py-3">Client Payments</th>
                      <th className="px-5 py-3">Platform Revenue</th>
                      <th className="px-5 py-3">Campaign Pool</th>
                      <th className="px-5 py-3">Dynamic Outflows</th>
                      <th className="px-5 py-3">Static Expenses</th>
                      <th className="px-5 py-3">Balance</th>
                      <th className="px-5 py-3">Net P&L</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCampaigns.map((item) => (
                      <tr key={item.campaign} className="border-t border-white/5 text-slate-300">
                        <td className="px-5 py-4 font-bold text-[#2b1422]">{item.campaign}</td>
                        <td className="px-5 py-4">{item.client}</td>
                        <td className="px-5 py-4 font-semibold text-emerald-300">{formatINR(item.clientPayments)}</td>
                        <td className="px-5 py-4 font-semibold text-amber-300">{formatINR(item.platformRevenue)}</td>
                        <td className="px-5 py-4 font-semibold text-cyan-300">{formatINR(item.campaignPool)}</td>
                        <td className="px-5 py-4 font-semibold text-rose-300">-{formatINR(item.dynamicOutflows)}</td>
                        <td className="px-5 py-4 font-semibold text-pink-300">-{formatINR(item.staticExpenses)}</td>
                        <td className={`px-5 py-4 font-bold ${item.remainingBalance >= 0 ? "text-cyan-300" : "text-red-300"}`}>
                          {formatINR(item.remainingBalance)}
                        </td>
                        <td className={`px-5 py-4 font-black ${item.netPL >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                          {formatINR(item.netPL)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
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

function StatusBadge({ status }: { status: CampaignPL["status"] }) {
  const className =
    status === "Healthy"
      ? "bg-emerald-500/10 text-emerald-300"
      : status === "Watch"
        ? "bg-amber-500/10 text-amber-300"
        : status === "Loss"
          ? "bg-red-500/10 text-red-300"
          : "bg-slate-500/10 text-slate-300"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {status}
    </span>
  )
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}
