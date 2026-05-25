"use client"

import { motion, useMotionValue } from "framer-motion"
import { Activity, Wallet, TrendingUp, Sparkles } from "lucide-react"
import { useRef } from "react"

const cards = [
  { title: "Revenue Intelligence",   icon: TrendingUp, description: "Real-time analytics across campaigns, subscriptions, and operational finance.", gradient: "from-cyan-500 to-blue-500",    spot: "rgba(6,182,212,0.1)"   },
  { title: "AI Finance Assistant",   icon: Sparkles,   description: "Smart forecasting and anomaly detection powered by financial intelligence.",   gradient: "from-purple-500 to-violet-500", spot: "rgba(168,85,247,0.1)"  },
  { title: "Transaction Monitoring", icon: Activity,   description: "Track live transaction flows and operational spending across departments.",    gradient: "from-blue-500 to-indigo-500",  spot: "rgba(59,130,246,0.1)"  },
  { title: "Fund Visibility",        icon: Wallet,     description: "Maintain complete clarity between campaign funds and company-owned capital.",  gradient: "from-emerald-500 to-cyan-500", spot: "rgba(16,185,129,0.1)"  },
]

function Card({ card, index }: { card: typeof cards[0]; index: number }) {
  const Icon = card.icon
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      className="group relative rounded-[36px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 overflow-hidden hover:border-white/[0.14] transition-all duration-500 cursor-default"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[36px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(350px circle at ${mx}px ${my}px, ${card.spot}, transparent 70%)` }}
      />
      <motion.div
        whileHover={{ scale: 1.1, rotate: 8 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={`h-16 w-16 rounded-3xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
      >
        <Icon size={28} strokeWidth={1.8} />
      </motion.div>
      <h3 className="mt-7 text-2xl font-bold">{card.title}</h3>
      <p className="mt-4 text-white/55 leading-relaxed text-[15px]">{card.description}</p>
      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className={`mt-8 h-[1px] bg-gradient-to-r ${card.gradient} opacity-35`}
      />
    </motion.div>
  )
}

export default function FinanceDashboard() {
  return (
    <section id="features" className="relative px-6 py-32 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="mb-20"
        >
          <div className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/40 mb-7">Features</div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Live Financial<br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">Infrastructure</span>
          </h2>
          <p className="mt-6 text-lg text-white/45 max-w-xl leading-relaxed">Built like a modern fintech OS — live insights, real-time tracking, AI forecasting, and enterprise-grade analytics.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-5">
          {cards.map((card, i) => <Card key={card.title} card={card} index={i} />)}
        </div>
      </div>
    </section>
  )
}
