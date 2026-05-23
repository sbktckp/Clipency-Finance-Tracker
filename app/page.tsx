"use client"

import Navbar from "@/components/landing/Navbar"
import HeroSection from "@/components/landing/HeroSection"
import FinanceDashboard from "@/components/landing/FinanceDashboard"
import AlgorithmSection from "@/components/landing/AlgorithmSection"
import TeamSection from "@/components/landing/TeamSection"
import Footer from "@/components/landing/Footer"
import ScrollProgress from "@/components/landing/ScrollProgress"
import CursorGlow from "@/components/landing/CursorGlow"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-[#030712] text-white overflow-hidden">
      <CursorGlow />
      <ScrollProgress />

      {/* Ambient Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb20,transparent_30%),radial-gradient(circle_at_bottom_left,#7c3aed20,transparent_30%)] pointer-events-none" />

      <div className="fixed inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:70px_70px]" />

      <Navbar />
      <HeroSection />
      <FinanceDashboard />
      <AlgorithmSection />
      <TeamSection />
      <Footer />
    </main>
  )
}
