"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Database, Cpu, Brain, BarChart3, Activity, LineChart } from "lucide-react"
import { useRef } from "react"

const steps = [
  { title: "Data Collection",        icon: Database,  description: "Capture transactions, payouts, subscriptions, and campaign flow with zero latency.", glow: "#10b981", gradient: "from-emerald-500 to-teal-500"   },
  { title: "Transaction Processing", icon: Cpu,       description: "Process operational finance events in real time with sub-second execution.",         glow: "#14b8a6", gradient: "from-teal-500 to-cyan-500"     },
  { title: "AI Insights",            icon: Brain,     description: "Detect anomalies and generate financial intelligence around the clock.",              glow: "#0ea5e9", gradient: "from-cyan-500 to-sky-500"      },
  { title: "Forecasting",            icon: LineChart, description: "Predict runway, burn rate, and future financial exposure with ML-driven models.",     glow: "#f59e0b", gradient: "from-amber-500 to-yellow-500" },
  { title: "Dashboard Analytics",    icon: BarChart3, description: "Visualize every key metric and business performance indicator instantly.",            glow: "#f97316", gradient: "from-amber-500 to-orange-500" },
  { title: "KPI Tracking",           icon: Activity,  description: "Monitor operational health with live KPI dashboards across all departments.",         glow: "#10b981", gradient: "from-orange-500 to-emerald-500"},
]

export default function AlgorithmSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.2"] })
  const rawH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const lineH = useSpring(rawH, { stiffness: 40, damping: 16 })

  return (
    <section id="algorithm" className="relative px-6 py-32 border-t border-white/[0.05]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(245,158,11,0.03),transparent)] pointer-events-none" />
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }} className="mb-20">
          <div className="inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/35 mb-7">Engine</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
            How Clipency's<br />
            <span className="bg-gradient-to-r from-emerald-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">Engine Works</span>
          </h2>
          <p className="mt-6 text-lg text-white/45 max-w-xl leading-relaxed">A modern financial processing architecture built for operational intelligence, live analytics, and scalable decisions.</p>
        </motion.div>

        <div ref={ref} className="relative">
          <div className="absolute left-[23px] top-4 bottom-4 w-px bg-white/[0.05]" />
          <motion.div className="absolute left-[23px] top-4 w-px" style={{ height: lineH, background: "linear-gradient(to bottom,#10b981,#14b8a6,#f59e0b,#f97316)" }} />
          <div className="space-y-5 pl-16">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={step.title} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }} transition={{ delay: i * 0.07, duration: 0.65, ease: "easeOut" }}
                  className="group relative">
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.07 + 0.2, type: "spring", stiffness: 350, damping: 22 }}
                    className="absolute -left-[46px] top-1/2 -translate-y-1/2 h-[18px] w-[18px] rounded-full border border-white/15 bg-[#030a06] flex items-center justify-center">
                    <div className={`h-2 w-2 rounded-full bg-gradient-to-br ${step.gradient}`} style={{ boxShadow: `0 0 6px ${step.glow}` }} />
                  </motion.div>
                  <div className="rounded-[28px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-6 group-hover:border-emerald-500/15 group-hover:bg-white/[0.04] transition-all duration-400">
                    <div className="flex items-center gap-4">
                      <motion.div whileHover={{ scale: 1.1, rotate: 8 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0`}
                        style={{ boxShadow: `0 6px 20px ${step.glow}35` }}>
                        <Icon size={20} strokeWidth={1.8} />
                      </motion.div>
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.22em] text-white/25">STEP {String(i+1).padStart(2,"0")}</span>
                        <h3 className="text-lg font-bold leading-tight">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 text-white/45 leading-relaxed text-sm pl-16">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
