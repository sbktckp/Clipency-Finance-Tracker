"use client"

import { useEffect, useState } from "react"

export default function ScrollProgress() {
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    const handle = () => {
      const total =
        document.documentElement.scrollHeight - window.innerHeight

      const progress = (window.scrollY / total) * 100

      setScroll(progress)
    }

    window.addEventListener("scroll", handle)

    return () => window.removeEventListener("scroll", handle)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-[9999]"
      style={{ width: `${scroll}%` }}
    />
  )
}
