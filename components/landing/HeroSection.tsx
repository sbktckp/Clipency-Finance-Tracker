"use client"
import { motion } from "framer-motion"
import CountUp from "react-countup"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const chartData = [
  { v: 42 }, { v: 58 }, { v: 51 }, { v: 78 }, { v: 69 },
  { v: 94 }, { v: 83 }, { v: 118 }, { v: 102 }, { v: 138 }, { v: 124 }, { v: 149 },
]

const kpis = [
  { label: "Revenue",     value: 14.2, pre: "₹", suf: "L",  dec: 1 },
  { label: "Growth",      value: 28,   pre: "+",  suf: "%", dec: 0 },
  { label: "Transactions",value: 1247, pre: "",   suf: "",  dec: 0 },
]

const feed = [
  { label: "Campaign payout",    value: "+₹42,000", positive: true  },
  { label: "Salary disbursement",value: "−19.2L",   positive: false },
  { label: "AI report ready",    value: "View →",   positive: null  },
]

export default function HeroSection() {
  return (
    <section className="relative px-8 pt-24 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">

        {/* LEFT */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] tracking-[0.35em] text-pink-300/50 font-medium uppercase mb-8"
          >
            Real-Time Financial Intelligence
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-[clamp(52px,6.5vw,82px)] font-black leading-[1.04] tracking-[-0.02em]"
          >
            Track.
            <br />
            Analyze.
            <br />
            <span className="text-pink-200/80">Scale.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 text-[15px] text-white/40 max-w-sm leading-relaxed font-normal"
          >
            Centralized financial infrastructure for payouts, campaigns, analytics, and operational control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center gap-4 mt-10"
          >
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-200 text-[#080005] text-sm font-semibold hover:bg-pink-100 transition-colors duration-200">
                Access Dashboard
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </motion.div>
            </Link>
            <a href="https://clipency.in" target="_blank"
              className="text-sm text-white/35 hover:text-white/70 transition-colors duration-300 underline underline-offset-4 decoration-white/15">
              Learn more
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-px mt-14 border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            {kpis.map((k, i) => (
              <div key={k.label} className="bg-white/[0.02] px-5 py-5">
                <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase font-medium">{k.label}</p>
                <h3 className="mt-2.5 text-2xl font-black text-white/90">
                  {k.pre}<CountUp end={k.value} decimals={k.dec} duration={2.5} />{k.suf}
                </h3>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Dashboard card */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-[radial-gradient(ellipse,rgba(249,168,212,0.07)_0%,transparent_70%)]" />
          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl overflow-hidden">

            {/* Card header */}
            <div className="px-7 pt-7 pb-5 border-b border-white/[0.05]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-white/35 tracking-[0.18em] uppercase">Total Revenue</p>
                  <h2 className="text-4xl font-black mt-1.5 tracking-tight">
                    ₹<CountUp end={14.2} decimals={1} duration={2.5} />L
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-1.5 w-1.5 rounded-full bg-pink-300"
                  />
                  <span className="text-[10px] text-pink-300/70 tracking-[0.2em] uppercase font-medium">Live</span>
                </div>
              </div>
              <p className="mt-2 text-[12px] text-pink-300/50 font-medium">+18.4% vs last month</p>
            </div>

            {/* Area chart */}
            <div className="px-2 pt-5 pb-2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f9a8d4" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#f9a8d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#f9a8d4" strokeWidth={1.5}
                    fill="url(#pinkGrad)" dot={false} activeDot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Feed */}
            <div className="px-7 pb-7 space-y-2">
              {feed.map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.12 }}
                  className="flex items-center justify-between py-3 border-t border-white/[0.04]"
                >
                  <span className="text-[13px] text-white/45">{item.label}</span>
                  <span className={`text-[13px] font-semibold ${
                    item.positive === true ? "text-pink-300" :
                    item.positive === false ? "text-white/35" :
                    "text-white/50"
                  }`}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
