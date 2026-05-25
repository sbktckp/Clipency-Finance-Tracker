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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.1 }}
      className={`sticky top-0 z-50 transition-all duration-700 ${
        scrolled ? "border-b border-white/[0.06] bg-[#080005]/85 backdrop-blur-2xl" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img src="/icon.png" alt="Clipency" className="h-9 w-9 rounded-xl" />
          <div>
            <span className="text-[15px] font-bold tracking-tight">Clipency</span>
            <p className="text-[9px] tracking-[0.4em] text-pink-300/60 font-medium">FINANCE OS</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href}
              className="text-sm text-white/40 hover:text-white transition-colors duration-300 font-medium tracking-wide">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="https://clipency.in" target="_blank"
            className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300 hidden sm:block">
            clipency.in
          </a>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <Link href="/login"
            className="px-5 py-2 rounded-lg bg-pink-300/10 border border-pink-300/20 text-pink-200 text-sm font-medium hover:bg-pink-300/15 hover:border-pink-300/35 transition-all duration-300">
            Login
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
