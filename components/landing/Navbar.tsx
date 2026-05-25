"use client"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Engine",   href: "#algorithm" },
  { label: "Team",     href: "#team" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 50))
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "backdrop-blur-2xl border-b border-pink-300/[0.1] bg-[#0a0008]/80" : "backdrop-blur-xl border-b border-pink-500/[0.06] bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
          <img src="/icon.png" alt="Clipency" className="h-11 w-11 rounded-2xl" />
          <div>
            <h1 className="text-xl font-black">Clipency</h1>
            <p className="text-pink-200 text-[10px] tracking-[0.35em]">FINANCE OS</p>
          </div>
        </motion.div>
        <div className="hidden md:flex items-center gap-1 rounded-2xl border border-pink-300/[0.12] bg-pink-400/[0.03] px-2 py-1.5">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="px-5 py-2 text-sm text-white/50 hover:text-pink-200 rounded-xl hover:bg-pink-400/[0.05] transition-all duration-200 font-medium">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="https://clipency.in" target="_blank" className="hidden sm:block px-4 py-2.5 rounded-xl border border-pink-500/15 bg-pink-400/[0.03] text-sm text-white/60 hover:text-white hover:bg-pink-400/[0.06] transition-all duration-200">
            clipency.in
          </a>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link href="/login" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-300 to-rose-300 text-sm font-semibold shadow-[0_0_20px_rgba(249,168,212,0.3)] hover:shadow-[0_0_35px_rgba(249,168,212,0.45)] transition-shadow duration-300">
              Login
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
