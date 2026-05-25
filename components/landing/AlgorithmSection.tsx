"use client"
import { motion } from "framer-motion"
import { Database, Cpu, Brain, LineChart, BarChart3, Activity } from "lucide-react"

const steps = [
  { n: "01", title: "Data Collection",        icon: Database,  body: "Every transaction, payout, subscription, and campaign event captured with zero latency." },
  { n: "02", title: "Transaction Processing", icon: Cpu,       body: "Operational finance events processed in real time. Sub-second execution across all flows." },
  { n: "03", title: "AI Insights",            icon: Brain,     body: "Anomaly detection and pattern recognition running continuously. No manual intervention needed." },
  { n: "04", title: "Forecasting",            icon: LineChart, body: "Runway, burn rate, and exposure predicted with ML models trained on your operational data." },
  { n: "05", title: "Dashboard Analytics",    icon: BarChart3, body: "Every KPI and performance metric visualized the moment it changes. No refresh needed." },
  { n: "06", title: "KPI Tracking",           icon: Activity,  body: "Operational health monitored across all departments. One source of truth for the whole company." },
]

export default function AlgorithmSection() {
  return (
    <section id="algorithm" className="px-8 py-28 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-[10px] tracking-[0.35em] text-pink-300/45 uppercase font-medium mb-5">Engine</p>
          <h2 className="text-5xl md:text-6xl font-black leading-[1.04] tracking-[-0.02em]">
            How it<br />
            <span className="text-white/30">works.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div key={step.n}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07, duration: 0.6 }}
                className="group bg-[#080005] p-8 hover:bg-white/[0.02] transition-colors duration-300 cursor-default"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] text-white/20 tracking-[0.28em] font-bold">{step.n}</span>
                  <div className="h-8 w-8 rounded-lg border border-white/[0.06] bg-transparent flex items-center justify-center group-hover:border-pink-300/15 transition-colors duration-300">
                    <Icon size={14} strokeWidth={1.6} className="text-white/25 group-hover:text-pink-300/50 transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-lg font-bold tracking-tight mb-2.5">{step.title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{step.body}</p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
