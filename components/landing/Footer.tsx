"use client"

import {
  User,
  Link,
  Code2,
  Send,
  Globe,
  Mail,
} from "lucide-react"

export default function Footer() {
  const socials = [
    User,
    Link,
    Code2,
    Send,
    Globe,
    Mail,
  ]

  return (
    <footer className="px-6 py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl font-black">
          Clipency Finance OS
        </h2>

        <p className="mt-5 text-white/60 text-lg">
          Built for modern operational finance.
        </p>

        {/* CLIPENCY SOCIAL LINKS */}
        {/* instagram: "" */}
        {/* linkedin: "" */}
        {/* github: "" */}
        {/* twitter: "" */}
        {/* website: "" */}
        {/* email: "" */}

        <div className="flex justify-center gap-6 mt-10">
          {socials.map((Icon, i) => (
            <div
              key={i}
              className="h-16 w-16 rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center hover:scale-110 hover:border-cyan-400/40 transition"
            >
              <Icon size={28} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
