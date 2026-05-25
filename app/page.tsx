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
    <main className="relative min-h-screen bg-[#030a06] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 24, ease: "easeInOut" }} className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-emerald-900/30 blur-[140px]" />
        <motion.div animate={{ x: [0, -35, 0], y: [0, 25, 0] }} transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }} className="absolute -bottom-40 -left-20 w-[650px] h-[650px] rounded-full bg-amber-900/20 blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }} className="absolute top-[45%] left-[35%] w-[500px] h-[500px] rounded-full bg-teal-900/25 blur-[120px]" />
      </div>
      <div className="fixed inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />
      <Navbar />
      <HeroSection />
      <FinanceDashboard />
      <AlgorithmSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
