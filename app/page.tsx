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
    <main className="relative min-h-screen bg-[#080005] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[900px] h-[600px] bg-[radial-gradient(ellipse,rgba(249,168,212,0.06)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(253,164,175,0.04)_0%,transparent_65%)]" />
      </div>
      <Navbar />
      <HeroSection />
      <FinanceDashboard />
      <AlgorithmSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
