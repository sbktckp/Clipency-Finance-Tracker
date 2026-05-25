"use client"
import { useScroll, useSpring, motion } from "framer-motion"
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] origin-left z-[9999]"
      style={{ scaleX, background: "linear-gradient(to right, rgba(249,168,212,0.4), rgba(249,168,212,0.9), rgba(253,164,175,0.4))" }}
    />
  )
}
