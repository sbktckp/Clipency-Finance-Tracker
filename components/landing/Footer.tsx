"use client"
import { motion } from "framer-motion"
import Link from "next/link"

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/clipency.in/",                   icon: "<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.8\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"0.5\" fill=\"currentColor\"/></svg>" },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/clipency",                 icon: "<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.8\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z\"/><rect x=\"2\" y=\"9\" width=\"4\" height=\"12\"/><circle cx=\"4\" cy=\"4\" r=\"2\"/></svg>" },
  { label: "YouTube",   href: "https://www.youtube.com/channel/UCKo5jGmm0Lz4JJTRSdnvPEA",  icon: "<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.8\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z\"/><polygon points=\"9.75 15.02 15.5 12 9.75 8.98 9.75 15.02\" fill=\"currentColor\" stroke=\"none\"/></svg>" },
  { label: "Email",     href: "mailto:contact@clipency.in",                                 icon: "<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"1.8\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z\"/><polyline points=\"22,6 12,13 2,6\"/></svg>" },
]

export default function Footer() {
  return (
    <footer className="relative px-8 py-20 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.06), transparent 60%)" }} />
      <div className="max-w-7xl mx-auto relative">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-14">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <img src="/icon.png" alt="Clipency" className="h-9 w-9 rounded-xl" />
              <div>
                <p className="text-[15px] font-bold">Clipency</p>
                <p className="text-[9px] tracking-[0.35em] text-pink-300/60">FINANCE OS</p>
              </div>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed">
              Financial infrastructure for modern operations. Track, analyze, and scale with confidence.
            </p>
          </div>

          <Link href="/login">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-pink-300 text-[#0a0006] font-bold text-sm tracking-wide hover:bg-pink-200 transition-colors duration-200 shadow-[0_0_32px_rgba(249,168,212,0.3)]">
              Get Started →
            </motion.button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            {socials.map(({ label, href, icon }) => (
              <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.93 }}
                aria-label={label}
                className="h-9 w-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/35 hover:text-pink-300 hover:border-pink-300/25 hover:bg-pink-300/[0.08] transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: icon }} />
            ))}
          </div>
          <div className="flex items-center gap-5 text-[12px] text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="mailto:contact@clipency.in" className="hover:text-white/50 transition-colors">Contact</a>
            <span className="text-white/15">© Clipency 2026</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
