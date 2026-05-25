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
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40))

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-pink-300/10 bg-[#0a0006]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(236,72,153,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
          <img src="/icon.png" alt="Clipency" className="h-9 w-9 rounded-xl" />
          <div>
            <span className="text-[15px] font-bold tracking-tight text-white">Clipency</span>
            <p className="text-[9px] tracking-[0.4em] text-pink-300/70 font-semibold">FINANCE OS</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-sm text-white/50 hover:text-pink-200 transition-colors duration-300 font-medium tracking-wide">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a href="https://clipency.in" target="_blank"
            className="hidden sm:block text-sm text-white/40 hover:text-white/70 transition-colors duration-300">
            clipency.in ↗
          </a>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href="/login"
              className="px-5 py-2.5 rounded-xl bg-pink-300 text-[#0a0006] text-sm font-bold tracking-wide hover:bg-pink-200 transition-colors duration-200 shadow-[0_0_24px_rgba(249,168,212,0.35)]">
              Login
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
