"use client"
import { motion, useMotionValue } from "framer-motion"
import { TrendingUp, Sparkles, Activity, Wallet } from "lucide-react"
import { useRef } from "react"

const cards = [
  {
    n: "01", title: "Revenue Intelligence", icon: TrendingUp,
    body: "Real-time analytics across campaigns, subscriptions, and operational finance. Every rupee tracked.",
    accent: "rgba(249,168,212,0.12)", border: "rgba(249,168,212,0.2)",
  },
  {
    n: "02", title: "AI Finance Assistant", icon: Sparkles,
    body: "Smart forecasting and anomaly detection. Surfaces insights before you even think to ask.",
    accent: "rgba(253,164,175,0.1)", border: "rgba(253,164,175,0.18)",
  },
  {
    n: "03", title: "Transaction Monitoring", icon: Activity,
    body: "Live transaction flows across every department. Sub-second visibility into where money moves.",
    accent: "rgba(249,168,212,0.1)", border: "rgba(249,168,212,0.16)",
  },
  {
    n: "04", title: "Fund Visibility", icon: Wallet,
    body: "Absolute clarity between campaign funds and company capital. No surprises at month end.",
    accent: "rgba(252,207,232,0.1)", border: "rgba(252,207,232,0.18)",
  },
]

function Card({ card, index }: { card: typeof cards[0]; index: number }) {
  const Icon = card.icon
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        mx.set(e.clientX - r.left)
        my.set(e.clientY - r.top)
      }}
      className="group relative rounded-[28px] p-7 overflow-hidden cursor-default transition-all duration-500"
      style={{ border: `1px solid ${card.border}`, background: card.accent, backdropFilter: "blur(16px)" }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[28px]"
        style={{ background: `radial-gradient(280px circle at ${mx}px ${my}px, rgba(249,168,212,0.12), transparent 70%)` }}
      />

      <div className="flex items-start justify-between mb-6">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(249,168,212,0.15)", border: "1px solid rgba(249,168,212,0.25)" }}>
          <Icon size={22} strokeWidth={1.7} className="text-pink-200" />
        </div>
        <span className="text-[10px] tracking-[0.25em] text-pink-300/50 font-bold mt-1">{card.n}</span>
      </div>

      <h3 className="text-[20px] font-bold tracking-tight text-white mb-3">{card.title}</h3>
      <p className="text-[14px] text-white/50 leading-relaxed">{card.body}</p>

      <motion.div
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.4, duration: 0.9 }}
        className="mt-6 h-px"
        style={{ background: "linear-gradient(to right, rgba(249,168,212,0.5), transparent)" }}
      />
    </motion.div>
  )
}

export default function FinanceDashboard() {
  return (
    <section id="features" className="relative px-8 py-32 border-t border-white/[0.06]">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(236,72,153,0.05), transparent)" }} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[10px] tracking-[0.35em] text-pink-300 font-semibold uppercase mb-5">Features</p>
          <div className="flex items-end justify-between gap-10">
            <h2 className="text-5xl md:text-6xl font-black leading-[1.04] tracking-[-0.02em]">
              Live Financial<br />
              <span className="bg-gradient-to-r from-pink-200 to-rose-300/70 bg-clip-text text-transparent">Infrastructure</span>
            </h2>
            <p className="hidden lg:block text-[14px] text-white/45 max-w-xs leading-relaxed mb-1">
              Every module built to give your operators complete financial control in real time.
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((card, i) => <Card key={card.n} card={card} index={i} />)}
        </div>
      </div>
    </section>
  )
}
