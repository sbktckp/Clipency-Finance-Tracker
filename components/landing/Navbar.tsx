"use client"

import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 50))

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-2xl border-b border-white/[0.08] bg-black/60 shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
          : "backdrop-blur-xl border-b border-white/[0.04] bg-black/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
          <img src="/icon.png" alt="Clipency" className="h-11 w-11 rounded-2xl" />
          <div>
            <h1 className="text-xl font-black">Clipency</h1>
            <p className="text-cyan-400 text-[10px] tracking-[0.35em]">FINANCE OS</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-2 py-1.5">
          {["Features", "Engine", "Team"].map((item) => (
            
              key={item}
              href={`#${(item as string).toLowerCase()}`}
              className="px-5 py-2 text-sm text-white/55 hover:text-white rounded-xl hover:bg-white/[0.07] transition-all duration-200 font-medium"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          
            href="https://clipency.in"
            target="_blank"
            className="hidden sm:block px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-sm text-white/70 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200"
          >
            clipency.in
          </a>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] transition-shadow duration-300"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
