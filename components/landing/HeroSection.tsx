"use client"

import { motion } from "framer-motion"
import CountUp from "react-countup"

export default function HeroSection() {
  return (
    <section className="relative px-6 pt-28 pb-24">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-cyan-300 text-sm backdrop-blur-xl">
            Real-Time Financial Intelligence
          </div>

          <h1 className="mt-8 text-6xl md:text-8xl font-black leading-tight">
            Track.
            <br />
            Analyze.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Scale.
            </span>
          </h1>

          <p className="mt-8 text-xl text-white/60 max-w-2xl leading-relaxed">
            Finance Intelligence for modern teams.
            Centralized financial infrastructure for payouts, campaigns,
            analytics, forecasting, and operational control.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">
            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              Access Dashboard
            </button>

            <a
              href="https://clipency.in"
              target="_blank"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              Explore Clipency.in
            </a>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-3 gap-5 mt-16">
            {[
              ["Revenue Flow", 14.2, "L"],
              ["Profit Growth", 28, "%"],
              ["Transactions", 1247, "+"],
            ].map(([title, value, suffix]) => (
              <div
                key={title}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
              >
                <p className="text-white/50 text-sm">{title}</p>

                <h3 className="mt-4 text-3xl font-black">
                  <CountUp end={Number(value)} duration={3} />
                  {suffix}
                </h3>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT DASHBOARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[40px] blur-3xl opacity-20" />

          <div className="relative rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
            {/* PLACE DASHBOARD IMAGE HERE */}
            {/* src="/images/dashboard-preview.png" */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50">Total Revenue</p>
                <h2 className="text-5xl font-black mt-2">
                  ₹14.2L
                </h2>
              </div>

              <div className="h-4 w-4 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Fake Graph */}
            <div className="mt-10 h-56 flex items-end gap-3">
              {[50, 80, 65, 110, 95, 140, 120].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ delay: i * 0.1 }}
                  className="flex-1 rounded-t-3xl bg-gradient-to-t from-blue-500 to-purple-500"
                />
              ))}
            </div>

            {/* Live Feed */}
            <div className="mt-10 space-y-4">
              {[
                "Campaign payout completed",
                "Salary batch processed",
                "AI insight generated",
              ].map((item) => (
                <motion.div
                  whileHover={{ x: 5 }}
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 flex items-center justify-between"
                >
                  <span>{item}</span>

                  <span className="text-emerald-400 text-sm">
                    Live
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
