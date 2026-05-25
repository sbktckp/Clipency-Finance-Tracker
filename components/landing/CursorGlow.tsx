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
      <motion.div className="fixed rounded-full pointer-events-none z-0" style={{ x: x1, y: y1, translateX: "-50%", translateY: "-50%", width: 260, height: 260, background: "radial-gradient(circle,rgba(249,168,212,0.1) 0%,rgba(251,113,133,0.07) 50%,transparent 70%)", filter: "blur(32px)" }} />
      <motion.div className="fixed rounded-full pointer-events-none z-0" style={{ x: x2, y: y2, translateX: "-50%", translateY: "-50%", width: 600, height: 600, background: "radial-gradient(circle,rgba(249,168,212,0.04) 0%,transparent 70%)", filter: "blur(80px)" }} />
    </>
  )
}
