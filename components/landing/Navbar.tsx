"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-2xl border-b border-white/10 bg-black/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* PLACE COMPANY LOGO HERE */}
          <img
            src="/icon.png"
            alt="Clipency"
            className="h-12 w-12 rounded-2xl"
          />

          <div>
            <h1 className="text-2xl font-black">
              Clipency
            </h1>

            <p className="text-cyan-400 text-xs tracking-[0.35em]">
              FINANCE OS
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm text-white/70">
          <a href="#features" className="hover:text-cyan-400 transition">Features</a>
          <a href="#algorithm" className="hover:text-cyan-400 transition">Engine</a>
          <a href="#team" className="hover:text-cyan-400 transition">Team</a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://clipency.in"
            target="_blank"
            className="px-5 py-2 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition"
          >
            Visit Clipency.in
          </a>

          <Link
            href="/login"
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold hover:scale-105 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
