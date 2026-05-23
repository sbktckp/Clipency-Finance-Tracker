"use client"

import { motion } from "framer-motion"
import { Link, TrendingUp, Activity, ShieldCheck } from "lucide-react"

const executives = [
  {
    name: "Ayush Bera",
    role: "CEO",
    linkedin: "https://www.linkedin.com/in/ayushbera/",
    glow: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    metrics: [
      { label: "Growth", value: "+248%" },
      { label: "Vision Score", value: "98%" },
      { label: "Execution", value: "A+" },
    ],

    // REPLACE WITH GOOGLE DRIVE DIRECT IMAGE URL
    image: "/ayush.png",
  },
  {
    name: "Shreya Roy",
    role: "CFO",
    linkedin: "https://www.linkedin.com/in/shreyaroy3004/",
    glow: "from-violet-500/30 to-fuchsia-500/30",
    border: "border-violet-400/40",
    featured: true,
    metrics: [
      { label: "Revenue Efficiency", value: "99.2%" },
      { label: "Forecast Accuracy", value: "97%" },
      { label: "Financial Ops", value: "Elite" },
    ],

    // REPLACE WITH GOOGLE DRIVE DIRECT IMAGE URL
    image: "/shreya.jpg",
  },
  {
    name: "Smit Bharat Patil",
    role: "CTO",
    linkedin: "https://www.linkedin.com/in/sbktckp/",
    glow: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    metrics: [
      { label: "System Uptime", value: "99.99%" },
      { label: "AI Accuracy", value: "96%" },
      { label: "Infra Scale", value: "10x" },
    ],

    // REPLACE WITH GOOGLE DRIVE DIRECT IMAGE URL
    image: "/smit.jpg",
  },
]

function KPIWidget({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
    >
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </motion.div>
  )
}

function LinkedInButton({ url }: { url: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-300"
    >
      <Link className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      Connect on LinkedIn
    </motion.a>
  )
}

function ExecutiveCard({ executive, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className={`group relative h-[520px] perspective ${
        executive.featured ? "scale-105 lg:-translate-y-4" : ""
      }`}
    >
      <motion.div
        whileHover={{
          rotateX: 6,
          rotateY: -6,
          y: -10,
        }}
        transition={{ duration: 0.4 }}
        className="relative h-full w-full transform-style-preserve-3d"
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-[32px] border ${executive.border} bg-gradient-to-br ${executive.glow} overflow-hidden backdrop-blur-2xl backface-visibility-hidden`}
        >
          {/* ambient glow */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
          </div>

          {/* grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <div className="relative flex h-full flex-col p-6">
            {/* top */}
            <div className="flex items-center justify-between">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-medium text-zinc-300 backdrop-blur-xl">
                Executive Panel
              </div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                Live
              </motion.div>
            </div>

            {/* profile */}
            <div className="mt-8 flex flex-col items-center text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 blur-xl opacity-50" />

                <img
                  src={executive.image}
                  alt={executive.name}
                  className="relative h-28 w-28 rounded-full border border-white/20 object-cover"
                />
              </motion.div>

              <h3 className="mt-5 text-2xl font-bold text-white">
                {executive.name}
              </h3>

              <div className="mt-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-300">
                {executive.role}
              </div>
            </div>

            {/* metrics */}
            <div className="mt-8 grid grid-cols-1 gap-4">
              {executive.metrics.map((metric: any, i: number) => (
                <KPIWidget key={i} {...metric} />
              ))}
            </div>

            {/* footer stats */}
            <div className="mt-auto flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
              <div>
                <p className="text-xs text-zinc-500">Operational Status</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Optimized
                </p>
              </div>

              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <Activity className="h-5 w-5 text-cyan-400" />
                <ShieldCheck className="h-5 w-5 text-violet-400" />
              </div>
            </div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rotate-y-180 rounded-[32px] border border-cyan-400/20 bg-black/80 p-8 backdrop-blur-3xl backface-visibility-hidden">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 p-6">
              <Link className="h-10 w-10 text-cyan-300" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-white">
              {executive.name}
            </h3>

            <p className="mt-2 text-zinc-400">
              Connect with {executive.role}
            </p>

            <div className="mt-8">
              <LinkedInButton url={executive.linkedin} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_40%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl">
            Executive Leadership
          </div>

          <h2 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl">
            Leadership Behind{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              Clipency
            </span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            The minds building the future of intelligent financial infrastructure.
          </p>
        </motion.div>

        {/* cards */}
        <div className="mt-24 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <ExecutiveCard executive={executives[0]} index={0} />
          <ExecutiveCard executive={executives[1]} index={1} />
          <ExecutiveCard executive={executives[2]} index={2} />
        </div>
      </div>
    </section>
  )
}
