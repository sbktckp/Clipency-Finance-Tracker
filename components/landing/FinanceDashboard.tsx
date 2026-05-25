"use client"
import { motion } from "framer-motion"
import { TrendingUp, Sparkles, Activity, Wallet } from "lucide-react"

const features = [
  { n: "01", title: "Revenue Intelligence",   icon: TrendingUp, body: "Real-time analytics across campaigns, subscriptions, and operational finance. Every rupee tracked, every trend visible." },
  { n: "02", title: "AI Finance Assistant",   icon: Sparkles,   body: "Smart forecasting and anomaly detection. Understands your financial patterns and surfaces insights before you ask." },
  { n: "03", title: "Transaction Monitoring", icon: Activity,   body: "Live transaction flows across every department. Sub-second visibility into where money moves and why." },
  { n: "04", title: "Fund Visibility",        icon: Wallet,     body: "Absolute clarity between campaign funds and company capital. No blurred lines, no surprises at month end." },
]

export default function FinanceDashboard() {
  return (
    <section id="features" className="px-8 py-28 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-20 gap-12"
        >
          <div>
            <p className="text-[10px] tracking-[0.35em] text-pink-300/45 uppercase font-medium mb-5">Features</p>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.04] tracking-[-0.02em]">
              Live Financial<br />
              <span className="text-white/30">Infrastructure</span>
            </h2>
          </div>
          <p className="hidden lg:block text-[14px] text-white/35 max-w-xs leading-relaxed mb-1">
            Built like a modern fintech OS. Every module designed to give operators complete financial control.
          </p>
        </motion.div>

        <div className="divide-y divide-white/[0.05]">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div key={f.n}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group grid grid-cols-[80px_1fr_auto] gap-8 items-start py-9 hover:bg-white/[0.015] transition-colors duration-300 px-4 -mx-4 rounded-2xl cursor-default"
              >
                <span className="text-[11px] text-white/20 tracking-[0.22em] font-bold pt-1">{f.n}</span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-pink-100 transition-colors duration-300">{f.title}</h3>
                  <p className="mt-2.5 text-[14px] text-white/40 leading-relaxed max-w-lg">{f.body}</p>
                </div>
                <div className="h-10 w-10 rounded-xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center mt-0.5 group-hover:border-pink-300/20 group-hover:bg-pink-300/[0.06] transition-all duration-300">
                  <Icon size={17} strokeWidth={1.6} className="text-white/35 group-hover:text-pink-300/70 transition-colors duration-300" />
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
