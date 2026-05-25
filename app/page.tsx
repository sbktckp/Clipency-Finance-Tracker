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
    <main className="relative min-h-screen bg-[#0a0008] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }} className="absolute -top-40 right-0 w-[700px] h-[700px] rounded-full bg-pink-300/10 blur-[140px]" />
        <motion.div animate={{ x: [0, -25, 0], y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 26, ease: "easeInOut" }} className="absolute -bottom-40 -left-20 w-[600px] h-[600px] rounded-full bg-rose-400/08 blur-[130px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.14, 0.06] }} transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }} className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-fuchsia-400/07 blur-[120px]" />
      </div>
      <div className="fixed inset-0 opacity-[0.012] bg-[radial-gradient(circle,#ffffff_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <Navbar />
      <HeroSection />
      <FinanceDashboard />
      <AlgorithmSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
