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
    accent: "from-cyan-500/20 via-blue-500/10 to-transparent",
    metrics: [
      { label: "Growth Rate", value: "+248%" },
      { label: "Market Expansion", value: "12 Regions" },
      { label: "Execution", value: "98%" },
    ],
  },
  {
    name: "Shreya Roy",
    role: "CFO",
    linkedin: "https://www.linkedin.com/in/shreyaroy3004/",
    image: "/shreya.JPG",
    featured: true,
    accent: "from-violet-500/25 via-fuchsia-500/10 to-transparent",
    metrics: [
      { label: "Revenue Efficiency", value: "99.2%" },
      { label: "Forecast Accuracy", value: "97%" },
      { label: "Financial Ops", value: "A+" },
    ],
  },
  {
    name: "Smit Bharat Patil",
    role: "CTO",
    linkedin: "https://www.linkedin.com/in/sbktckp/",
    image: "/smit.JPG",
    featured: false,
    accent: "from-emerald-500/20 via-teal-500/10 to-transparent",
    metrics: [
      { label: "System Uptime", value: "99.99%" },
      { label: "AI Accuracy", value: "96%" },
      { label: "Infra Scale", value: "12M+" },
    ],
  },
]

function KPIItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">
        {label}
      </p>

      <div className="mt-2 flex items-end gap-1">
        <span className="text-2xl font-semibold tracking-tight text-white">
          {value}
        </span>
      </div>
    </div>
  )
}

function BadgeCheckCTA({ url }: { url: string }) {
  return (
    <Link
      href={url}
      target="_blank"
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10"
    >
      <BadgeCheck className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      Connect on BadgeCheck
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
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        type: "spring",
      }}
      viewport={{ once: true }}
      className={`relative ${
        executive.featured ? "lg:scale-[1.04] lg:-translate-y-3" : ""
      }`}
      style={{ perspective: "1800px" }}
      onHoverStart={() => setFlipped(true)}
      onHoverEnd={() => setFlipped(false)}
    >
      {/* ambient glow */}
      <div
        className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${executive.accent} blur-3xl`}
      />

      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="relative h-[540px] w-full"
      >
        {/* FRONT */}
        <div
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className={`absolute inset-0 rounded-[32px] border border-white/10 bg-[#0B1120]/80 p-6 backdrop-blur-2xl ${
            executive.featured
              ? "shadow-[0_0_60px_rgba(139,92,246,0.18)]"
              : "shadow-[0_0_40px_rgba(59,130,246,0.08)]"
          }`}
        >
          {/* top glow line */}
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* live badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-300">
                Live Executive
              </span>
            </div>

            {executive.featured && (
              <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200">
                Spotlight
              </div>
            )}
          </div>

          {/* profile */}
          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />

              <Image
                src={executive.image}
                alt={executive.name}
                width={108}
                height={108}
                className="relative h-28 w-28 rounded-full border border-white/15 object-cover shadow-2xl"
              />
            </div>

            <h3 className="mt-5 text-3xl font-semibold tracking-tight text-white">
              {executive.name}
            </h3>

            <div className="mt-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
              {executive.role}
            </div>
          </div>

          {/* finance visual */}
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Executive Analytics
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-300" />
                  <span className="text-2xl font-semibold text-white">
                    +34.8%
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <Activity className="h-5 w-5 text-violet-300" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                </div>
              </div>
            </div>
          </div>

          {/* KPI grid */}
          <div className="mt-6 grid grid-cols-1 gap-4">
            {executive.metrics.map((metric) => (
              <motion.div
                key={metric.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <KPIItem {...metric} />
              </motion.div>
            ))}
          </div>

          {/* bottom subtle gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 rounded-b-[32px] bg-gradient-to-t from-white/[0.03] to-transparent" />
        </div>

        {/* BACK */}
        <div
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-[32px] border border-white/10 bg-[#0B1120]/95 p-8 text-center backdrop-blur-2xl ${
            executive.featured
              ? "shadow-[0_0_70px_rgba(168,85,247,0.18)]"
              : "shadow-[0_0_40px_rgba(59,130,246,0.10)]"
          }`}
        >
          <div
            className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${executive.accent} opacity-40`}
          />

          <div className="relative z-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              <BadgeCheck className="h-10 w-10 text-cyan-300" />
            </div>

            <h4 className="mt-8 text-3xl font-semibold tracking-tight text-white">
              Connect with {executive.name.split(" ")[0]}
            </h4>

            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Explore executive leadership and professional network.
            </p>

            <div className="mt-8">
              <BadgeCheckCTA url={executive.linkedin} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-[#020617] py-32">
      {/* mesh gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

      {/* animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* floating lights */}
      <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            Executive Leadership
          </div>

          <h2 className="mt-8 bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl">
            Leadership Behind Clipency
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            The minds building the future of intelligent financial
            infrastructure.
          </p>
        </motion.div>

        {/* cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
          <ExecutiveCard executive={executives[0]} index={0} />
          <ExecutiveCard executive={executives[1]} index={1} />
          <ExecutiveCard executive={executives[2]} index={2} />
        </div>
      </div>
    </section>
  )
}
