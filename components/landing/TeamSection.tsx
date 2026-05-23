"use client"

import { motion } from "framer-motion"
import { User, Link, Code2 } from "lucide-react"

const members = [
  {
    name: "Ayush",
    role: "CEO",
    image: "/images/team/ceo.jpg",

    // CEO SOCIAL LINKS
    instagram: "",
    linkedin: "",
    github: "",
  },
  {
    name: "Smit",
    role: "CTO",
    image: "/images/team/cto.jpg",

    instagram: "",
    linkedin: "",
    github: "",
  },
  {
    name: "CFO Name",
    role: "CFO",
    image: "/images/team/cfo.jpg",

    instagram: "",
    linkedin: "",
    github: "",
  },
]

export default function TeamSection() {
  return (
    <section
      id="team"
      className="px-6 py-28 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-5xl font-black">
            Leadership Team
          </h2>

          <p className="mt-5 text-white/60 text-xl">
            Building the financial operating system for modern creator businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {members.map((member) => (
            <motion.div
              key={member.name}
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.8 }}
              className="relative h-[420px] rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div className="absolute inset-0 p-8 backface-hidden">
                {/* PLACE TEAM IMAGE HERE */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-56 object-cover rounded-3xl"
                />

                <h3 className="mt-8 text-3xl font-bold">
                  {member.name}
                </h3>

                <p className="text-cyan-400 mt-2">
                  {member.role}
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-black/30 p-4">
                    <p className="text-white/50 text-sm">Growth</p>
                    <h4 className="text-2xl font-bold mt-2">+28%</h4>
                  </div>

                  <div className="rounded-2xl bg-black/30 p-4">
                    <p className="text-white/50 text-sm">Efficiency</p>
                    <h4 className="text-2xl font-bold mt-2">94%</h4>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 flex flex-col items-center justify-center gap-8"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex gap-6">
                  {[User, Link, Code2].map((Icon, i) => (
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      key={i}
                      className="h-16 w-16 rounded-3xl bg-white/10 flex items-center justify-center"
                    >
                      <Icon size={28} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
