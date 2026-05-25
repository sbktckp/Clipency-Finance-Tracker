"use client"
import { useScroll, useSpring, motion } from "framer-motion"
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <>
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[9999]"
        style={{ scaleX, background: "linear-gradient(to right, #fbcfe8, #f9a8d4, #fb7185)" }} />
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[9998] blur-[3px] opacity-80"
        style={{ scaleX, background: "linear-gradient(to right, #fbcfe8, #f9a8d4, #fb7185)" }} />
    </>
  )
}
