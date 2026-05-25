"use client"
import Navbar from "@/components/landing/Navbar"
import HeroSection from "@/components/landing/HeroSection"
import FinanceDashboard from "@/components/landing/FinanceDashboard"
import AlgorithmSection from "@/components/landing/AlgorithmSection"
import TeamSection from "@/components/landing/TeamSection"
import Footer from "@/components/landing/Footer"
import ScrollProgress from "@/components/landing/ScrollProgress"
import CursorGlow from "@/components/landing/CursorGlow"
import { motion } from "framer-motion"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#030712] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }} className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-blue-700/[0.07] blur-[140px]" />
        <motion.div animate={{ x: [0, -35, 0], y: [0, 25, 0] }} transition={{ repeat: Infinity, duration: 28, ease: "easeInOut" }} className="absolute -bottom-40 -left-20 w-[650px] h-[650px] rounded-full bg-purple-700/[0.08] blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.09, 0.04] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }} className="absolute top-[45%] left-[35%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>
      <div className="fixed inset-0 opacity-[0.018] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
      <Navbar />
      <HeroSection />
      <FinanceDashboard />
      <AlgorithmSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
