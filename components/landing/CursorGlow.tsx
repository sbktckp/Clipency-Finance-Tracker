"use client"

import { useEffect, useState } from "react"

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", move)

    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <div
      className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 blur-3xl opacity-20 bg-cyan-400"
      style={{
        left: position.x - 250,
        top: position.y - 250,
      }}
    />
  )
}
