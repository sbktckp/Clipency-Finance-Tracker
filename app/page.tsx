"use client"

import Link from "next/link"
import { motion } from "framer-motion"

const features = [
  {
    title: "Real-Time Financial Tracking",
    description:
      "Every credit, debit, payout, salary, refund, and marketing expense updates the ecosystem instantly across dashboards, reports, and projections.",
  },
  {
    title: "Campaign Fund Isolation",
    description:
      "Client-linked campaign money remains separated from company-owned operating capital for complete financial clarity.",
  },
  {
    title: "Executive Reports & Projections",
    description:
      "Generate monthly snapshots, runway analysis, burn-rate visibility, and financial forecasting in seconds.",
  },
  {
    title: "Live Currency Engine",
    description:
      "Switch between INR and USD across the entire platform using live exchange-rate integration.",
  },
]

const workflow = [
  {
    step: "01",
    title: "Track Transactions",
    desc: "Credits, debits, salaries, subscriptions, payouts, taxes, and campaign expenses are logged centrally.",
  },
  {
    step: "02",
    title: "Auto-Sync Financials",
    desc: "Every transaction automatically updates dashboards, reports, funds, and projections in real time.",
  },
  {
    step: "03",
    title: "Analyse Business Health",
    desc: "Monitor runway, operational burn, campaign profitability, tax exposure, and fund distribution.",
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#04010d] text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf620,transparent_30%),radial-gradient(circle_at_bottom_left,#06b6d420,transparent_30%)] pointer-events-none" />

      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/10 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <img
            src="/icon.png"
            alt="Clipency"
            className="h-12 w-12 rounded-2xl border border-white/10 shadow-2xl"
          />

          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Clipency
            </h1>

            <p className="text-cyan-300 text-sm tracking-[0.35em]">
              FINANCE OS
            </p>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <a
            href="https://clipency.in"
            target="_blank"
            className="hidden md:flex px-5 py-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300"
          >
            Visit Clipency.in
          </a>

          <Link
            href="/login"
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:scale-105 transition-all duration-300 font-semibold shadow-2xl"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-24 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm mb-6 backdrop-blur-xl">
              Internal Financial Intelligence System
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Financial
              <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
                {" "}Command Centre
              </span>
            </h1>

            <p className="mt-8 text-lg text-white/70 leading-relaxed max-w-2xl">
              Clipency Finance OS centralizes operational finance into one
              intelligent system — handling payouts, salaries, campaign
              expenses, taxes, projections, subscriptions, reports, and live
              fund movement in real time.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/login"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(168,85,247,0.35)]"
              >
                Access Finance OS
              </Link>

              <a
                href="https://clipency.in"
                target="_blank"
                className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                Explore Clipency.in
              </a>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-5 mt-14">
              {[
                ["Live Tracking", "24/7"],
                ["Currency Engine", "INR/USD"],
                ["Finance Visibility", "Real-Time"],
              ].map(([title, value]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <p className="text-white/50 text-sm">{title}</p>

                  <h3 className="text-2xl font-bold mt-3 bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                    {value}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-[36px] blur-3xl opacity-20" />

            <div className="relative rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
              {/* Fake topbar */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-5">
                {[
                  ["Static Fund", "₹14.2L"],
                  ["Dynamic Fund", "₹8.6L"],
                  ["Campaign Profit", "+18.4%"],
                  ["Operational Burn", "-6.2%"],
                ].map(([title, value]) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={title}
                    className="rounded-3xl bg-white/5 border border-white/10 p-6"
                  >
                    <p className="text-white/50 text-sm">{title}</p>

                    <h3 className="text-3xl font-black mt-3">
                      {value}
                    </h3>
                  </motion.div>
                ))}
              </div>

              {/* Graph */}
              <div className="mt-8 rounded-3xl border border-fuchsia-500/20 bg-fuchsia-500/10 p-6">
                <div className="flex items-end gap-3 h-40">
                  {[35, 60, 45, 90, 70, 110, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ delay: i * 0.1 }}
                      className="flex-1 rounded-t-2xl bg-gradient-to-t from-fuchsia-500 to-cyan-400"
                    />
                  ))}
                </div>

                <div className="flex justify-between text-xs text-white/40 mt-4">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workflow */}
      <section className="relative z-10 px-6 md:px-12 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black">
              How the system works
            </h2>

            <p className="mt-4 text-white/60 text-lg max-w-3xl">
              The Finance OS connects every financial activity into one live
              operational ecosystem instead of disconnected sheets and reports.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {workflow.map((item) => (
              <motion.div
                whileHover={{ y: -8 }}
                key={item.step}
                className="rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <div className="text-5xl font-black text-cyan-300/30">
                  {item.step}
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black">
              Core Features
            </h2>

            <p className="mt-4 text-white/60 text-lg">
              Designed for operational clarity, control, and financial
              accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <motion.div
                whileHover={{ y: -8 }}
                key={feature.title}
                className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:border-cyan-400/30 transition-all duration-500"
              >
                <h3 className="text-2xl font-bold mb-5 bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                  {feature.title}
                </h3>

                <p className="text-white/60 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto rounded-[40px] border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10 p-14 backdrop-blur-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-black">
            Built for real operational finance.
          </h2>

          <p className="mt-6 text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
            Clipency Finance OS transforms company finance into a centralized
            command infrastructure with live visibility, projections,
            accountability, and operational control.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <Link
              href="/login"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 font-semibold hover:scale-105 transition-all duration-300"
            >
              Enter Finance OS
            </Link>

            <a
              href="https://clipency.in"
              target="_blank"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              Visit Clipency.in
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
