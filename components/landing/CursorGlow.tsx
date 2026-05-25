"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function CursorGlow() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x1 = useSpring(mx, { stiffness: 120, damping: 25 })
  const y1 = useSpring(my, { stiffness: 120, damping: 25 })
  const x2 = useSpring(mx, { stiffness: 35, damping: 18 })
  const y2 = useSpring(my, { stiffness: 35, damping: 18 })
  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [mx, my])
  return (
    <>
      <motion.div className="fixed rounded-full pointer-events-none z-0" style={{ x: x1, y: y1, translateX: "-50%", translateY: "-50%", width: 280, height: 280, background: "radial-gradient(circle,rgba(34,211,238,0.13) 0%,rgba(139,92,246,0.07) 50%,transparent 70%)", filter: "blur(35px)" }} />
      <motion.div className="fixed rounded-full pointer-events-none z-0" style={{ x: x2, y: y2, translateX: "-50%", translateY: "-50%", width: 650, height: 650, background: "radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 70%)", filter: "blur(80px)" }} />
    </>
  )
}
