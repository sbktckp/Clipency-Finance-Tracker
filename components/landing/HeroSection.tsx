"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import CountUp from "react-countup"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

const words = ["Track.", "Analyze.", "Scale."]
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
}
const word = {
  hidden: { opacity: 0, y: 60, skewY: 5 },
  show: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}
const bars = [50, 80, 65, 110, 95, 140, 120]
const feed = [
  { text: "Campaign payout completed", amount: "+₹42,000", color: "text-emerald-400" },
  { text: "Salary batch processed",    amount: "−₹1.2L",   color: "text-red-400"     },
  { text: "AI insight generated",      amount: "New",      color: "text-cyan-400"    },
]

export default function HeroSection() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-300, 300], [8, -8]), { stiffness: 80, damping: 25 })
  const rotateY = useSpring(useTransform(mx, [-300, 300], [-8, 8]), { stiffness: 80, damping: 25 })

  return (
    <section className="relative px-6 pt-28 pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.07),transparent)] pointer-events-none" />
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">

        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/20 bg-cyan-500/[0.08] px-4 py-2 text-cyan-300 text-sm backdrop-blur-xl"
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.9)]"
            />
            Real-Time Financial Intelligence
          </motion.div>

          <motion.div variants={container} initial="hidden" animate="show" className="mt-8">
            {words.map((w, i) => (
              <div key={w} className="overflow-hidden leading-[1.08]">
                <motion.div variants={word}>
                  <span className={`block text-[clamp(52px,7.5vw,88px)] font-black tracking-tight ${
                    i === 2 ? "bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent" : "text-white"
                  }`}>{w}</span>
                </motion.div>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-8 text-lg text-white/55 max-w-md leading-relaxed"
          >
            Finance Intelligence for modern teams. Centralized infrastructure for payouts, campaigns, analytics, forecasting, and operational control.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold shadow-[0_0_40px_rgba(99,102,241,0.35)] hover:shadow-[0_0_55px_rgba(99,102,241,0.55)] transition-shadow duration-300"
              >
                Access Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </Link>
            <a href="https://clipency.in" target="_blank">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 font-medium text-white/80"
              >
                Explore Clipency.in
              </motion.button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="grid grid-cols-3 gap-4 mt-14"
          >
            {[["Revenue Flow","₹","14.2","L",1],["Profit Growth","+","28","%",0],["Transactions","","1247","+",0]].map(([label,pre,val,suf,dec]) => (
              <motion.div key={label} whileHover={{ y: -5, borderColor: "rgba(6,182,212,0.3)" }}
                className="rounded-[22px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300">
                <p className="text-white/35 text-xs font-medium tracking-wide">{label}</p>
                <h3 className="mt-3 text-2xl font-black">{pre}<CountUp end={Number(val)} decimals={Number(dec)} duration={2.5} />{suf}</h3>
                <div className="mt-3 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — tilt card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          style={{ rotateX, rotateY, transformPerspective: 1400 }}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            mx.set(e.clientX - r.left - r.width / 2)
            my.set(e.clientY - r.top - r.height / 2)
          }}
          onMouseLeave={() => { mx.set(0); my.set(0) }}
        >
          <div className="absolute -inset-5 bg-gradient-to-br from-blue-600/15 to-purple-600/15 rounded-[52px] blur-3xl" />
          <div className="relative rounded-[40px] border border-white/[0.09] bg-black/70 backdrop-blur-2xl p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_32px_64px_rgba(0,0,0,0.5)]">

            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-white/40 text-sm">Total Revenue</p>
                <h2 className="text-4xl font-black mt-1.5">₹<CountUp end={14.2} decimals={1} duration={2.5} />L</h2>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp size={13} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">+18.4% this month</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20">
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6 }}
                  className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                />
                <span className="text-emerald-400 text-xs font-bold tracking-wide">LIVE</span>
              </div>
            </div>

            <div className="h-44 flex items-end gap-2.5">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                  className="flex-1 rounded-t-2xl bg-gradient-to-t from-blue-500/80 to-purple-500/80"
                />
              ))}
            </div>

            <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

            <div className="space-y-2.5">
              {feed.map((item, i) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 + i * 0.15 }}
                  whileHover={{ x: 5 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 flex items-center justify-between"
                >
                  <span className="text-sm text-white/60">{item.text}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.amount}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
