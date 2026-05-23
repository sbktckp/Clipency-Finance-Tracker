"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Wallet,
  TrendingUp,
  Sparkles,
} from "lucide-react"

const cards = [
  {
    title: "Revenue Intelligence",
    icon: TrendingUp,
    description:
      "Real-time analytics across campaigns, subscriptions, and operational finance.",
  },
  {
    title: "AI Finance Assistant",
    icon: Sparkles,
    description:
      "Smart forecasting and anomaly detection powered by financial intelligence.",
  },
  {
    title: "Transaction Monitoring",
    icon: Activity,
    description:
      "Track live transaction flows and operational spending across departments.",
  },
  {
    title: "Fund Visibility",
    icon: Wallet,
    description:
      "Maintain complete clarity between dynamic campaign funds and company-owned capital.",
  },
]

export default function FinanceDashboard() {
  return (
    <section
      id="features"
      className="px-6 py-28 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl font-black">
            Live Financial Infrastructure
          </h2>

          <p className="mt-5 text-xl text-white/60 max-w-3xl">
            Built like a modern fintech operating system with live insights,
            real-time tracking, AI forecasting, and enterprise-grade analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 hover:border-cyan-400/30 transition"
              >
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Icon size={30} />
                </div>

                <h3 className="mt-8 text-3xl font-bold">
                  {card.title}
                </h3>

                <p className="mt-5 text-white/60 leading-relaxed text-lg">
                  {card.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
