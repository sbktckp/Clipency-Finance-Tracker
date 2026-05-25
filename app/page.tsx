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
    <main className="relative min-h-screen bg-[#0a0006] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute -top-64 -right-32 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.14) 0%, rgba(244,63,94,0.06) 45%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-48 -left-32 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,113,133,0.1) 0%, rgba(236,72,153,0.04) 50%, transparent 70%)" }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{ background: "radial-gradient(ellipse, rgba(249,168,212,0.04) 0%, transparent 70%)" }} />
      </div>
      <div className="fixed inset-0 opacity-[0.022]"
        style={{ backgroundImage: "url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")",
          backgroundRepeat: "repeat", backgroundSize: "200px 200px" }} />
      <Navbar />
      <HeroSection />
      <FinanceDashboard />
      <AlgorithmSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
