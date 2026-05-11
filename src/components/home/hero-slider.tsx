"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Zap, Loader2 } from "lucide-react"
import { NeonButton } from "../ui/neon-button"
import { cn } from "@/lib/utils"

const STATIC_BANNERS = [
  {
    title: "PRO <span class='text-primary'>GAMING</span>",
    description: "A engenharia definitiva para quem busca a supremacia digital.",
    image_url: "/images/banners/gamer-banner.png",
    link_url: "/loja?cat=Setup Master",
    id: "1"
  },
  {
    title: "TECH <span class='text-primary'>HOME</span>",
    description: "O futuro da automação e eletrodomésticos de elite para sua casa.",
    image_url: "/images/banners/eletrodomesticos-banner.png",
    link_url: "/loja?cat=Tech Home",
    id: "2"
  },
  {
    title: "HOME <span class='text-primary'>LUXURY</span>",
    description: "Conforto e sofisticação em cada detalhe da sua Cama, Mesa e Banho.",
    image_url: "/images/banners/cama-mesa-banho-banner.png",
    link_url: "/loja?cat=Home Luxury",
    id: "3"
  }
]

export function HeroSlider() {
  const [banners] = useState(STATIC_BANNERS)
  const [[page, direction], setPage] = useState([0, 0])
  const [loadingImage, setLoadingImage] = useState(true)

  const currentIndex = Math.abs(page % banners.length)

  const paginate = useCallback((newDirection: number) => {
    setLoadingImage(true)
    setPage([page + newDirection, newDirection])
  }, [page])

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 7000)
    return () => clearInterval(timer)
  }, [paginate])

  const slideVariants: import("framer-motion").Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    animate: {
      z: 0,
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -30 : 30,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" }
    })
  }

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative w-full h-[300px] md:h-[500px] bg-background overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <div className="relative w-full h-full block group">
             {loadingImage && (
               <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                 <Loader2 className="h-12 w-12 text-primary animate-spin" />
               </div>
             )}
             
             {/* Ken Burns Effect (Zoom Suave Aleatório) */}
             <motion.div 
               className="absolute inset-0"
               initial={{ scale: 1 }}
               animate={{ scale: 1.25 }}
               transition={{ duration: 15, ease: "easeOut" }}
               key={`img-${currentIndex}`}
               style={{ 
                 transformOrigin: [
                   "center", 
                   "top left", 
                   "top right", 
                   "bottom left", 
                   "bottom right"
                 ][currentIndex % 5] 
               }}
             >
               <Image 
                 src={currentBanner.image_url} 
                 alt="Banner" 
                 fill 
                 className={cn(
                   "object-cover brightness-[0.4] transition-opacity duration-1000",
                   loadingImage ? "opacity-0" : "opacity-100"
                 )}
                 priority
                 unoptimized
                 onLoad={() => setLoadingImage(false)}
               />
             </motion.div>
             
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent flex flex-col justify-end md:justify-center px-6 lg:px-24 pb-20 md:pb-0">
                <div className="max-w-4xl">
                  <h1 
                    className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter italic leading-none mb-4"
                    dangerouslySetInnerHTML={{ __html: currentBanner.title }}
                  />
                  <p className="text-sm md:text-lg text-text-secondary font-bold mb-8 max-w-xl opacity-90">
                    {currentBanner.description}
                  </p>
                  
                  <Link href={currentBanner.link_url || "/"}>
                    <NeonButton 
                      size="sm"
                      className="h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg"
                    >
                      Ver Segmento
                    </NeonButton>
                  </Link>
                </div>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Control Bar */}
      <div className="absolute bottom-6 left-6 right-6 md:left-24 md:right-24 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          {banners.map((_, i) => (
            <button 
              key={i}
              onClick={() => setPage([i, i > currentIndex ? 1 : -1])}
              className="group py-2"
            >
              <div className={`h-[2px] transition-all duration-700 ${
                i === currentIndex ? "w-12 md:w-16 bg-primary shadow-neon-strong" : "w-6 md:w-8 bg-white/10 group-hover:bg-white/30"
              }`} />
              <span className={`block text-xs font-bold mt-1 transition-opacity duration-700 ${i === currentIndex ? "opacity-100 text-primary" : "opacity-0"}`}>
                0{i + 1}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={(e) => { e.preventDefault(); paginate(-1); }}
            className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-background transition-all shadow-xl active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); paginate(1); }}
            className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-background transition-all shadow-xl active:scale-95"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>

      {/* Tech Overlay Lines */}
      <div className="absolute inset-0 pointer-events-none z-20">
         <div className="absolute inset-4 md:inset-8 border border-white/10 rounded-3xl" />
         <div className="absolute inset-0 bg-grid-tech opacity-10" />
         <div className="scanline" />
      </div>
    </section>
  )
}
