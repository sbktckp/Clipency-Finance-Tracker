"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Link2 } from "lucide-react"

const executives = [
  {
    name: "Ayush Bera",
    role: "CEO",
    image: "/ayush.png",
    linkedin: "https://www.linkedin.com/in/ayushbera/",
    featured: false,
  },
  {
    name: "Shreya Roy",
    role: "CFO",
    image: "/shreya.JPG",
    linkedin: "https://www.linkedin.com/in/shreyaroy3004/",
    featured: true,
  },
  {
    name: "Smit Bharat Patil",
    role: "CTO",
    image: "/smit.JPG",
    linkedin: "https://www.linkedin.com/in/sbktckp/",
    featured: false,
  },
]

function LinkedInButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
    >
      <Link2 className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      <span>Connect on LinkedIn</span>
    </Link>
  )
}

function ExecutivePortraitCard({
  executive,
  index,
}: {
  executive: (typeof executives)[0]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -10,
        rotateX: 2,
        rotateY: executive.featured ? 0 : index === 0 ? -2 : 2,
        scale: executive.featured ? 1.03 : 1.015,
      }}
      className={`group relative w-full ${
        executive.featured
          ? "md:-mt-6 md:scale-[1.04]"
          : ""
      }`}
      style={{
        perspective: 2000,
      }}
    >
      <div
        className={`absolute inset-0 rounded-[34px] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 ${
          executive.featured
            ? "bg-violet-500/20"
            : "bg-cyan-500/10"
        }`}
      />

      <div
        className={`relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl transition-all duration-500 ${
          executive.featured
            ? "shadow-[0_20px_80px_rgba(139,92,246,0.18)]"
            : "shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

        <div
          className={`absolute inset-[1px] rounded-[33px] ${
            executive.featured
              ? "bg-gradient-to-b from-violet-500/10 via-black/40 to-black"
              : "bg-gradient-to-b from-cyan-500/5 via-black/40 to-black"
          }`}
        />

        <div className="relative p-4">
          <div className="relative overflow-hidden rounded-[28px]">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            <div
              className={`absolute inset-0 z-10 opacity-60 ${
                executive.featured
                  ? "bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_45%)]"
                  : "bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_45%)]"
              }`}
            />

            <div className="aspect-[9/16] relative">
              <Image
                src={executive.image}
                alt={executive.name}
                fill
                priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
              <div className="mb-5 flex items-center gap-2">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    executive.featured
                      ? "bg-violet-400 shadow-[0_0_18px_rgba(192,132,252,0.9)]"
                      : "bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
                  }`}
                />

                <span className="text-xs uppercase tracking-[0.24em] text-white/55">
                  {executive.role}
                </span>
              </div>

              <h3 className="text-2xl font-semibold tracking-tight text-white">
                {executive.name}
              </h3>

              <div className="mt-5">
                <LinkedInButton href={executive.linkedin} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function TeamSection() {
  return (
    <section className="relative overflow-hidden bg-black py-28 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/50 backdrop-blur-xl">
            Leadership
          </div>

          <h2 className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-6xl">
            Leadership Behind Clipency
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            The minds building the future of intelligent financial infrastructure.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3 md:items-center">
          <ExecutivePortraitCard executive={executives[0]} index={0} />
          <ExecutivePortraitCard executive={executives[1]} index={1} />
          <ExecutivePortraitCard executive={executives[2]} index={2} />
        </div>

        <div className="mt-24 flex flex-col items-center justify-center">
          <div className="mb-5 h-px w-28 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <p className="text-sm tracking-wide text-white/35">
            © Clipency 2026. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  )
}
