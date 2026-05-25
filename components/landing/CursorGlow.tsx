"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
export default function CursorGlow() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 60, damping: 20 })
  const y = useSpring(my, { stiffness: 60, damping: 20 })
  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [mx, my])
  return (
    <motion.div
      className="fixed rounded-full pointer-events-none z-0"
      style={{ x, y, translateX: "-50%", translateY: "-50%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(249,168,212,0.055) 0%, transparent 65%)",
        filter: "blur(40px)" }}
    />
  )
}
