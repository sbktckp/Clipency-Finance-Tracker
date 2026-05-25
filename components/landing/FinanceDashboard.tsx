"use client"
import { motion, useMotionValue } from "framer-motion"
import { Activity, Wallet, TrendingUp, Sparkles } from "lucide-react"
import { useRef } from "react"

const cards = [
  { title: "Revenue Intelligence",   icon: TrendingUp, description: "Real-time analytics across campaigns, subscriptions, and operational finance.", gradient: "from-pink-500 to-rose-500",     spot: "rgba(236,72,153,0.1)"   },
  { title: "AI Finance Assistant",   icon: Sparkles,   description: "Smart forecasting and anomaly detection powered by financial intelligence.",   gradient: "from-fuchsia-500 to-pink-500",  spot: "rgba(217,70,239,0.09)"  },
  { title: "Transaction Monitoring", icon: Activity,   description: "Track live transaction flows and operational spending across departments.",    gradient: "from-rose-500 to-pink-400",     spot: "rgba(251,113,133,0.09)" },
  { title: "Fund Visibility",        icon: Wallet,     description: "Maintain complete clarity between campaign funds and company-owned capital.",  gradient: "from-pink-400 to-fuchsia-500",  spot: "rgba(236,72,153,0.08)"  },
]

function Card({ card, index }: { card: typeof cards[0]; index: number }) {
  const Icon = card.icon
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.75, ease: "easeOut" }}
      whileHover={{ y: -8 }}
      onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top) }}
      className="group relative rounded-[36px] border border-pink-500/[0.1] bg-pink-500/[0.03] backdrop-blur-xl p-8 overflow-hidden hover:border-pink-400/25 transition-all duration-500 cursor-default">
      <motion.div className="pointer-events-none absolute inset-0 rounded-[36px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(350px circle at ${mx}px ${my}px, ${card.spot}, transparent 70%)` }} />
      <motion.div whileHover={{ scale: 1.1, rotate: 8 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className={`h-16 w-16 rounded-3xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-[0_8px_24px_rgba(236,72,153,0.3)]`}>
        <Icon size={28} strokeWidth={1.8} />
      </motion.div>
      <h3 className="mt-7 text-2xl font-bold">{card.title}</h3>
      <p className="mt-4 text-white/50 leading-relaxed text-[15px]">{card.description}</p>
      <motion.div initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
        className={`mt-8 h-[1px] bg-gradient-to-r ${card.gradient} opacity-45`} />
    </motion.div>
  )
}

export default function FinanceDashboard() {
  return (
    <section id="features" className="relative px-6 py-32 border-t border-pink-500/[0.07]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(236,72,153,0.03),transparent)] pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }} className="mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/[0.15] bg-pink-500/[0.05] px-4 py-2 text-xs uppercase tracking-[0.28em] text-pink-300/70 mb-7">
            <span>✨</span> Features
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
            Live Financial<br />
            <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent">Infrastructure</span>
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
