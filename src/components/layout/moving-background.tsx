"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function MovingBackground() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Não renderiza no Dashboard para manter foco e performance
  if (!mounted || pathname?.startsWith('/dashboard') || pathname === '/login') return null

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-background">
      {/* 1. Base Grid - Yellow Tech Lines (The one user liked) */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #c6ff00 1px, transparent 1px),
            linear-gradient(to bottom, #c6ff00 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* 2. Central Circular Glow (Degradê Circular) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,255,0,0.15)_0%,transparent_80%)]" />
      
      {/* 3. Moving Atmospheric Glows */}
      <motion.div 
        animate={{
          x: [0, 200, -100, 0],
          y: [0, -100, 100, 0],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-primary/20 blur-[180px] rounded-full mix-blend-screen"
      />

      <motion.div 
        animate={{
          x: [0, -200, 100, 0],
          y: [0, 150, -150, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-primary/20 blur-[200px] rounded-full mix-blend-screen"
      />

      {/* 3. Static Grain Texture for Premium Finish */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 4. Subtle Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* 5. Scanning Pulse Line */}
      <motion.div 
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent shadow-[0_0_15px_rgba(198,255,0,0.05)]"
      />
    </div>
  )
}
