"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts"

type Credit = {
  amount?: number
  static_fund_amount?: number
  dynamic_fund_amount?: number
  payment_date?: string
}

type Debit = {
  amount?: number
  fund_type?: string
  payment_date?: string
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

function safeNumber(value: unknown) {
  return Number(value || 0)
}

export function FinanceCharts({
  credits,
  debits,
}: {
  credits: Credit[]
  debits: Debit[]
}) {
  const staticCredits = credits.reduce(
    (sum, item) => sum + safeNumber(item.static_fund_amount),
    0
  )

  const dynamicCredits = credits.reduce(
    (sum, item) => sum + safeNumber(item.dynamic_fund_amount),
    0
  )

  const staticDebits = debits
    .filter((item) => item.fund_type === "static")
    .reduce((sum, item) => sum + safeNumber(item.amount), 0)

  const dynamicDebits = debits
    .filter((item) => item.fund_type === "dynamic")
    .reduce((sum, item) => sum + safeNumber(item.amount), 0)

  const staticFund = staticCredits - staticDebits
  const dynamicFund = dynamicCredits - dynamicDebits
  const totalCredits = credits.reduce((sum, item) => sum + safeNumber(item.amount), 0)
  const totalDebits = debits.reduce((sum, item) => sum + safeNumber(item.amount), 0)

  const fundSplitData = [
    { name: "Static Fund", value: Math.max(staticFund, 0), color: "#a855f7" },
    { name: "Dynamic Fund", value: Math.max(dynamicFund, 0), color: "#06b6d4" },
  ]

  const inflowOutflowData = [
    { name: "Credits", amount: totalCredits, color: "#10b981" },
    { name: "Debits", amount: totalDebits, color: "#fb7185" },
  ]

  const healthData = [
    {
      name: "Static Safety",
      value: staticCredits > 0 ? Math.round((staticFund / staticCredits) * 100) : 0,
    },
    {
      name: "Dynamic Safety",
      value: dynamicCredits > 0 ? Math.round((dynamicFund / dynamicCredits) * 100) : 0,
    },
    {
      name: "Debit Pressure",
      value: totalCredits > 0 ? Math.round((totalDebits / totalCredits) * 100) : 0,
    },
  ]

  const trendMap = new Map<string, { date: string; credits: number; debits: number }>()

  credits.forEach((item) => {
    const date = item.payment_date || "Unknown"
    const existing = trendMap.get(date) || { date, credits: 0, debits: 0 }
    existing.credits += safeNumber(item.amount)
    trendMap.set(date, existing)
  })

  debits.forEach((item) => {
    const date = item.payment_date || "Unknown"
    const existing = trendMap.get(date) || { date, credits: 0, debits: 0 }
    existing.debits += safeNumber(item.amount)
    trendMap.set(date, existing)
  })

  const trendData = Array.from(trendMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-8)

  return (
    <div className="mt-10 grid gap-6 xl:grid-cols-2">
      <ChartCard
        label="Fund Architecture"
        title="Static vs Dynamic Fund"
        subtitle="Live split between company-owned and campaign-linked money."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fundSplitData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={4}
              >
                {fundSplitData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatINR(Number(value))}
                contentStyle={{
                  background: "#080b16",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  color: "#ffffff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MiniStat label="Static Fund" value={formatINR(staticFund)} tone="violet" />
          <MiniStat label="Dynamic Fund" value={formatINR(dynamicFund)} tone="cyan" />
        </div>
      </ChartCard>

      <ChartCard
        label="Money Movement"
        title="Credits vs Debits"
        subtitle="Total recorded inflow against total recorded outflow."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inflowOutflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} />
              <Tooltip
                formatter={(value) => formatINR(Number(value))}
                contentStyle={{
                  background: "#080b16",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  color: "#ffffff",
                }}
              />
              <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                {inflowOutflowData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <ChartCard
        label="Control Health"
        title="Finance Health Indicators"
        subtitle="Safety ratio and debit pressure across the finance system."
      >
        <div className="space-y-5">
          {healthData.map((item) => (
            <div key={item.name}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">{item.name}</span>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
                  style={{ width: `${Math.max(0, Math.min(item.value, 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard
        label="Recent Trend"
        title="Inflow / Outflow Timeline"
        subtitle="Recent credit and debit movement by payment date."
      >
        <div className="h-72">
          {trendData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              No trend data available yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${Math.round(value / 1000)}k`} />
                <Tooltip
                  formatter={(value) => formatINR(Number(value))}
                  contentStyle={{
                    background: "#080b16",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "14px",
                    color: "#ffffff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="credits"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="debits"
                  stroke="#fb7185"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  )
}

function ChartCard({
  label,
  title,
  subtitle,
  children,
}: {
  label: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          {label}
        </p>
        <h2 className="mt-3 text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: "violet" | "cyan"
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-2 text-xl font-black ${
          tone === "violet" ? "text-violet-300" : "text-cyan-300"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
