"use client"

import { motion } from "framer-motion"
import { Camera, Briefcase, Code2, MessageCircle, Globe, Mail } from "lucide-react"

const socials = [
  { Icon: Camera,        href: "#",                        label: "Instagram" },
  { Icon: Briefcase,     href: "#",                        label: "LinkedIn"  },
  { Icon: Code2,         href: "#",                        label: "GitHub"    },
  { Icon: MessageCircle, href: "#",                        label: "Twitter"   },
  { Icon: Globe,         href: "https://clipency.in",      label: "Website"   },
  { Icon: Mail,          href: "mailto:hello@clipency.in", label: "Email"     },
]

export default function Footer() {
  return (
    <footer className="relative px-6 py-24 border-t border-white/[0.06] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(139,92,246,0.05),transparent_60%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}>
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent tracking-tight">
            Clipency Finance OS
          </h2>
          <p className="mt-4 text-white/35 text-base">Built for modern operational finance.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.7 }} className="mt-8">
          <a href="/login">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 font-semibold text-sm shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_55px_rgba(99,102,241,0.5)] transition-shadow duration-300"
            >
              Get Started →
            </motion.button>
          </a>
        </motion.div>

        <div className="flex justify-center gap-3 mt-12">
          {socials.map(({ Icon, href, label }, i) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 300, damping: 22 }}
              whileHover={{ scale: 1.18, y: -5 }}
              whileTap={{ scale: 0.93 }}
              aria-label={label}
              className="h-[52px] w-[52px] rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center hover:border-cyan-400/25 hover:bg-cyan-500/[0.07] transition-all duration-300"
            >
              <Icon size={20} strokeWidth={1.8} className="text-white/50" />
            </motion.a>
          ))}
        </div>

        <div className="mt-14 w-full h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-8 text-white/20 text-sm">
          © Clipency 2026. All rights reserved.
        </motion.p>
      </div>
    </footer>
  )
}
