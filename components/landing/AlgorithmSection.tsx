"use client"

import { motion } from "framer-motion"
import {
  Database,
  Cpu,
  Brain,
  BarChart3,
  Activity,
  LineChart,
} from "lucide-react"

const steps = [
  {
    title: "Data Collection",
    icon: Database,
    description: "Capture transactions, payouts, subscriptions, and campaign flow.",
  },
  {
    title: "Transaction Processing",
    icon: Cpu,
    description: "Process operational finance events in real time.",
  },
  {
    title: "AI Insights",
    icon: Brain,
    description: "Detect anomalies and generate financial intelligence.",
  },
  {
    title: "Forecasting",
    icon: LineChart,
    description: "Predict runway, burn rate, and future exposure.",
  },
  {
    title: "Dashboard Analytics",
    icon: BarChart3,
    description: "Visualize metrics and business performance instantly.",
  },
  {
    title: "KPI Tracking",
    icon: Activity,
    description: "Track operational health with live KPI monitoring.",
  },
]

export default function AlgorithmSection() {
  return (
    <section
      id="algorithm"
      className="px-6 py-28 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="text-5xl font-black">
            How Clipency’s Financial Engine Works
          </h2>

          <p className="mt-5 text-white/60 text-xl max-w-3xl">
            A modern financial processing architecture designed for operational
            intelligence, live analytics, and scalable decision-making.
          </p>
        </div>

        <div className="space-y-10">
          {steps.map((step, i) => {
            const Icon = step.icon

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Icon size={30} />
                  </div>

                  <div>
                    <h3 className="text-3xl font-bold">
                      {step.title}
                    </h3>

                    <p className="mt-4 text-white/60 text-lg max-w-3xl">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
