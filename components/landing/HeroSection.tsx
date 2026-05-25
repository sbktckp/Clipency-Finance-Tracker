"use client"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import CountUp from "react-countup"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { ArrowUpRight, TrendingUp } from "lucide-react"
import Link from "next/link"

const chartData = [
  {v:38},{v:55},{v:47},{v:72},{v:61},{v:88},{v:79},
  {v:105},{v:92},{v:122},{v:108},{v:138},{v:124},{v:149},
]

const kpis = [
  { label: "Revenue",     pre: "₹", val: 14.2, suf: "L",  dec: 1 },
  { label: "Growth",      pre: "+",  val: 28,   suf: "%", dec: 0 },
  { label: "Transactions",pre: "",   val: 1247, suf: "",  dec: 0 },
]

const feedItems = [
  { text: "Campaign payout completed", amount: "+₹42,000",  color: "text-pink-300"  },
  { text: "Salary batch processed",    amount: "−19.2L",    color: "text-white/40"  },
  { text: "AI insight generated",      amount: "New →",     color: "text-pink-200"  },
]

export default function HeroSection() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX = useSpring(useTransform(my, [-300, 300], [6, -6]), { stiffness: 80, damping: 26 })
  const rotY = useSpring(useTransform(mx, [-300, 300], [-6, 6]), { stiffness: 80, damping: 26 })

  return (
    <section className="relative px-8 pt-20 pb-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-16 items-center min-h-[85vh]">

        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="h-2 w-2 rounded-full bg-pink-300 shadow-[0_0_10px_rgba(249,168,212,0.8)]"
            />
            <span className="text-[11px] tracking-[0.32em] text-pink-300/80 font-semibold uppercase">Real-Time Financial Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-[clamp(56px,7vw,88px)] font-black leading-[1.02] tracking-[-0.025em]"
          >
            Track.
            <br />
            Analyze.
            <br />
            <span className="bg-gradient-to-r from-pink-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">
              Scale.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-7 text-[16px] text-white/55 max-w-[400px] leading-relaxed"
          >
            Finance Intelligence for modern teams. Centralized infrastructure for payouts, campaigns, analytics, and operational control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="flex items-center gap-4 mt-10"
          >
            <Link href="/login">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-pink-300 text-[#0a0006] font-bold text-sm tracking-wide hover:bg-pink-200 transition-colors duration-200 shadow-[0_0_32px_rgba(249,168,212,0.4)]">
                Access Dashboard
                <ArrowUpRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </motion.button>
            </Link>
            <a href="https://clipency.in" target="_blank"
              className="text-sm text-white/40 hover:text-white/70 transition-colors duration-300 font-medium">
              Explore Clipency.in →
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-3 mt-12"
          >
            {kpis.map((k) => (
              <div key={k.label}
                className="rounded-2xl border border-pink-300/15 bg-pink-300/[0.06] px-5 py-4 backdrop-blur-sm">
                <p className="text-[10px] text-pink-300/60 tracking-[0.2em] uppercase font-semibold">{k.label}</p>
                <h3 className="mt-2 text-[22px] font-black text-white">
                  {k.pre}<CountUp end={k.val} decimals={k.dec} duration={2.5} />{k.suf}
                </h3>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — tilt card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.18 }}
          style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1400 }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            mx.set(e.clientX - r.left - r.width / 2)
            my.set(e.clientY - r.top - r.height / 2)
          }}
          onMouseLeave={() => { mx.set(0); my.set(0) }}
          className="relative"
        >
          <div className="absolute -inset-8 rounded-[56px]"
            style={{ background: "radial-gradient(ellipse, rgba(236,72,153,0.18) 0%, rgba(249,168,212,0.08) 45%, transparent 70%)" }} />
          <div className="absolute -inset-2 rounded-[44px] border border-pink-300/10"
            style={{ boxShadow: "0 0 60px rgba(236,72,153,0.12), inset 0 0 40px rgba(249,168,212,0.04)" }} />

          <div className="relative rounded-[36px] border border-pink-300/[0.18] bg-[#0f000a]/80 backdrop-blur-2xl overflow-hidden"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(249,168,212,0.12)" }}>

            {/* Top gradient line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-pink-300/40 to-transparent" />

            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[11px] tracking-[0.22em] text-white/40 uppercase font-medium">Total Revenue</p>
                  <h2 className="text-[42px] font-black mt-1 tracking-tight leading-none">
                    ₹<CountUp end={14.2} decimals={1} duration={2.5} />L
                  </h2>
                  <div className="flex items-center gap-1.5 mt-2">
                    <TrendingUp size={12} className="text-pink-300" />
                    <span className="text-xs text-pink-300 font-semibold">+18.4% this month</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-300/10 border border-pink-300/25">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.8 }}
                    className="h-1.5 w-1.5 rounded-full bg-pink-300 shadow-[0_0_6px_rgba(249,168,212,0.9)]"
                  />
                  <span className="text-[10px] text-pink-300 font-bold tracking-[0.18em]">LIVE</span>
                </div>
              </div>

              {/* Area chart */}
              <div className="h-40 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pinkFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f9a8d4" stopOpacity={0.35} />
                        <stop offset="75%" stopColor="#f9a8d4" stopOpacity={0.04} />
                        <stop offset="100%" stopColor="#f9a8d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v"
                      stroke="#f9a8d4" strokeWidth={2}
                      fill="url(#pinkFill)"
                      dot={false} activeDot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-pink-300/15 to-transparent" />

              {/* Feed */}
              <div className="space-y-2">
                {feedItems.map((item, i) => (
                  <motion.div key={item.text}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + i * 0.14 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-[13px] text-white/55">{item.text}</span>
                    <span className={`text-[13px] font-semibold ${item.color}`}>{item.amount}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
