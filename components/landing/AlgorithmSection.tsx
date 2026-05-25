"use client"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Database, Cpu, Brain, LineChart, BarChart3, Activity } from "lucide-react"
import { useRef } from "react"

const steps = [
  { n: "01", title: "Data Collection",        icon: Database,  body: "Every transaction, payout, subscription, and campaign event captured with zero latency."           },
  { n: "02", title: "Transaction Processing", icon: Cpu,       body: "Operational finance events processed in real time. Sub-second execution across all flows."          },
  { n: "03", title: "AI Insights",            icon: Brain,     body: "Anomaly detection and pattern recognition running continuously in the background."                  },
  { n: "04", title: "Forecasting",            icon: LineChart, body: "Runway, burn rate, and financial exposure predicted with models trained on your data."               },
  { n: "05", title: "Dashboard Analytics",    icon: BarChart3, body: "Every KPI and performance metric visualized the moment it changes. No refresh needed."              },
  { n: "06", title: "KPI Tracking",           icon: Activity,  body: "Operational health monitored across all departments. One source of truth for the whole company."    },
]

export default function AlgorithmSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.2"] })
  const rawH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const lineH = useSpring(rawH, { stiffness: 40, damping: 16 })

  return (
    <section id="algorithm" className="relative px-8 py-32 border-t border-white/[0.06]">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 30% 50%, rgba(249,168,212,0.04), transparent)" }} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.35em] text-pink-300 font-semibold uppercase mb-5">Engine</p>
          <h2 className="text-5xl md:text-6xl font-black leading-[1.04] tracking-[-0.02em]">
            How it<br />
            <span className="bg-gradient-to-r from-pink-200 to-rose-300/70 bg-clip-text text-transparent">works.</span>
          </h2>
        </motion.div>

        <div ref={ref} className="relative pl-12">
          {/* Track */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.07]" />
          {/* Fill */}
          <motion.div className="absolute left-[7px] top-2 w-px origin-top"
            style={{ height: lineH, background: "linear-gradient(to bottom, #fbcfe8, #f9a8d4, #fb7185)" }} />

          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={step.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="group relative"
                >
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, type: "spring", stiffness: 350, damping: 22 }}
                    className="absolute -left-12 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-pink-300/30 bg-[#0a0006] flex items-center justify-center"
                    style={{ boxShadow: "0 0 10px rgba(249,168,212,0.25)" }}
                  >
                    <div className="h-[7px] w-[7px] rounded-full bg-pink-300"
                      style={{ boxShadow: "0 0 6px rgba(249,168,212,0.8)" }} />
                  </motion.div>

                  <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 group-hover:border-pink-300/20 group-hover:bg-pink-300/[0.04] transition-all duration-400 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(249,168,212,0.12)", border: "1px solid rgba(249,168,212,0.2)" }}>
                        <Icon size={17} strokeWidth={1.7} className="text-pink-200" />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold tracking-[0.28em] text-pink-300/40">{step.n}</span>
                        <h3 className="text-[16px] font-bold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-[13px] text-white/45 leading-relaxed pl-[56px]">{step.body}</p>
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
