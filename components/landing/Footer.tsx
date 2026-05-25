"use client"
import { motion } from "framer-motion"

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/clipency.in/",
    svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>',
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/clipency",
    svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCKo5jGmm0Lz4JJTRSdnvPEA",
    svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>',
  },
  {
    label: "Email",
    href: "mailto:contact@clipency.in",
    svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  },
]

export default function Footer() {
  return (
    <footer className="relative px-6 py-24 border-t border-white/[0.05] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(16,185,129,0.04),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-b from-white via-white/85 to-white/25 bg-clip-text text-transparent tracking-tight">
            Clipency Finance OS
          </h2>
          <p className="mt-4 text-white/35 text-base">Built for modern operational finance.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.7 }} className="mt-8">
          <a href="/login">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold text-sm shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:shadow-[0_0_55px_rgba(16,185,129,0.45)] transition-shadow duration-300">
              Get Started →
            </motion.button>
          </a>
        </motion.div>

        <div className="flex justify-center gap-4 mt-12">
          {socials.map(({ svg, href, label }, i) => (
            <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300, damping: 22 }}
              whileHover={{ scale: 1.18, y: -5 }} whileTap={{ scale: 0.93 }} aria-label={label}
              className="h-[52px] w-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/45 hover:text-white hover:border-emerald-500/25 hover:bg-emerald-500/[0.07] transition-all duration-300"
              dangerouslySetInnerHTML={{ __html: svg }} />
          ))}
        </div>

        <div className="mt-14 w-full h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-white/20 text-sm">
          <p>© Clipency 2026. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white/50 transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors duration-200">Terms of Service</a>
            <a href="mailto:contact@clipency.in" className="hover:text-white/50 transition-colors duration-200">Contact</a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
