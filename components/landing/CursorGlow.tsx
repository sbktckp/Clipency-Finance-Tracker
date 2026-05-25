"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
export default function CursorGlow() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 70, damping: 22 })
  const y = useSpring(my, { stiffness: 70, damping: 22 })
  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [mx, my])
  return (
    <motion.div className="fixed rounded-full pointer-events-none z-0"
      style={{ x, y, translateX: "-50%", translateY: "-50%",
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(249,168,212,0.09) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)",
        filter: "blur(32px)" }} />
  )
}
