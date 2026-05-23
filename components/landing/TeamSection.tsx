"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BadgeCheck, TrendingUp, Activity, ShieldCheck } from "lucide-react"
import { useState } from "react"

const executives = [
  {
    name: "Ayush Bera",
    role: "CEO",
    linkedin: "https://www.linkedin.com/in/ayushbera/",
    image: "/ayush.png",
    featured: false,
    metrics: [
      { label: "Growth Rate", value: "+248%", icon: TrendingUp },
      { label: "Market Expansion", value: "12 Regions", icon: Activity },
      { label: "Execution", value: "98%", icon: ShieldCheck },
    ],
  },
  {
    name: "Shreya Roy",
    role: "CFO",
    linkedin: "https://www.linkedin.com/in/shreyaroy3004/",
    image: "/shreya.JPG",
    featured: true,
    metrics: [
      { label: "Revenue Efficiency", value: "99.2%", icon: TrendingUp },
      { label: "Forecast Accuracy", value: "97%", icon: Activity },
      { label: "Financial Ops", value: "24/7", icon: ShieldCheck },
    ],
  },
  {
    name: "Smit Bharat Patil",
    role: "CTO",
    linkedin: "https://www.linkedin.com/in/sbktckp/",
    image: "/smit.JPG",
    featured: false,
    metrics: [
      { label: "System Uptime", value: "99.99%", icon: ShieldCheck },
      { label: "AI Accuracy", value: "96.4%", icon: Activity },
      { label: "Infra Scale", value: "32 Nodes", icon: TrendingUp },
    ],
  },
]

function KPIItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: any
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05]">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-white/45">{label}</span>
        <Icon className="h-4 w-4 text-cyan-300/80" />
      </div>

      <div className="text-xl font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  )
}

function LinkedInCTA({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]"
    >
      <BadgeCheck className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      Connect on LinkedIn
    </Link>
  )
}

function ExecutiveCard({
  executive,
  index,
}: {
  executive: (typeof executives)[0]
  index: number
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        type: "spring",
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -8,
        rotateX: 2,
        rotateY: executive.featured ? 0 : index === 0 ? -2 : 2,
      }}
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
      className={`group relative h-[540px] w-full perspective-[2000px] ${
        executive.featured ? "lg:scale-[1.04]" : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        animate={{
          rotateY: flipped ? 180 : 0,
        }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 90,
          damping: 18,
        }}
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1120]/90 p-7 shadow-2xl backdrop-blur-2xl ${
            executive.featured
              ? "shadow-[0_0_80px_rgba(168,85,247,0.18)]"
              : "shadow-[0_0_50px_rgba(15,23,42,0.5)]"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

          <div
            className={`absolute inset-0 opacity-60 ${
              executive.featured
                ? "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_45%)]"
                : "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_45%)]"
            }`}
          />

          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-white/10">
                  <Image
                    src={executive.image}
                    alt={executive.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white">
                    {executive.name}
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                    {executive.role}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {executive.metrics.map((metric) => (
                <KPIItem key={metric.label} {...metric} />
              ))}
            </div>

            <div className="mt-auto pt-8">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#0B1120]/95 p-8 backdrop-blur-2xl"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_60%)]" />

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
              <BadgeCheck className="h-10 w-10 text-cyan-300" />
            </div>

            <LinkedInCTA href={executive.linkedin} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-[#020617] px-6 py-28">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <h2 className="bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl">
            Leadership Behind Clipency
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/55">
            The minds building the future of intelligent financial infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
          <ExecutiveCard executive={executives[0]} index={0} />
          <ExecutiveCard executive={executives[1]} index={1} />
          <ExecutiveCard executive={executives[2]} index={2} />
        </div>
      </div>
    </section>
  )
}
